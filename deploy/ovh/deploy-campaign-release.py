"""Migrate an isolated restored database first, then deploy with automatic image rollback."""
import pathlib,subprocess,socket,json,datetime,time,re,sys,urllib.parse
assert socket.gethostname()=='vps-60dc9315'
sha=sys.argv[1];assert re.fullmatch('[a-f0-9]{40}',sha)
root=pathlib.Path('/home/ubuntu/beyond-platform');shared=root/'shared';short=sha[:7];release=root/'releases'/short;image='beyond-platform:'+short
assert json.loads(subprocess.check_output(['docker','image','inspect',image]))[0]['Config']['Labels']['org.opencontainers.image.revision']==sha
backup=json.loads((shared/'last-backup.json').read_text());assert backup['status']=='PASS'
assert (datetime.datetime.now(datetime.UTC)-datetime.datetime.fromtimestamp(pathlib.Path(backup['backup']).stat().st_mtime,datetime.UTC)).total_seconds()<86400
prefix=['docker','exec','beyond-expertise-beyond-db-1'];dbuser='beyond';stage='beyond_campaign_stage_'+short
def run(cmd,**kw):return subprocess.run(cmd,check=True,**kw)
def sql(database,q):return subprocess.check_output(prefix+['psql','-U',dbuser,'-d',database,'-At','-c',q],text=True).strip()
def git(*args):return subprocess.check_output(['git','-c','safe.directory='+str(release),'-C',str(release),*args],text=True).strip()
assert git('rev-parse','HEAD')==sha
run(prefix+['createdb','-U',dbuser,'-O',dbuser,'-T',backup['restoredDatabase'],stage])
env=dict(l.split('=',1) for l in (shared/'api-production.env').read_text().splitlines() if '=' in l and not l.startswith('#'))
for k in ['DATABASE_URL','DIRECT_URL']:
 u=urllib.parse.urlsplit(env[k]);assert u.path=='/beyond_expertise';env[k]=urllib.parse.urlunsplit(u._replace(path='/'+stage))
stage_env=shared/('campaign-stage-'+short+'.env');stage_env.write_text(''.join(k+'='+v+'\n' for k,v in env.items()));stage_env.chmod(0o600)
tables=sql(stage,"SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename NOT IN ('AuthSession','AuthThrottle','_prisma_migrations') ORDER BY tablename").splitlines()
queries={}
for t in tables:
 cols=sql(stage,"SELECT string_agg(quote_ident(column_name),',' ORDER BY ordinal_position) FROM information_schema.columns WHERE table_schema='public' AND table_name='"+t+"'")
 queries[t]='SELECT count(*)::text || \':\' || md5(coalesce(string_agg(row_to_json(x)::text,\'\' ORDER BY row_to_json(x)::text),\'\')) FROM (SELECT '+cols+' FROM "'+t+'") x'
before={t:sql(stage,q) for t,q in queries.items()}
run(['docker','run','--rm','--network','beyond-expertise_default','--env-file',str(stage_env),image,'node','node_modules/prisma/build/index.js','migrate','deploy'])
assert all(before[t]==sql(stage,q) for t,q in queries.items()),'Existing fields changed during stage migration'
net='beyond-campaign-'+short;api='beyond-campaign-api-'+short;web='beyond-campaign-web-'+short
run(['docker','network','create',net],stdout=subprocess.DEVNULL)
run(['docker','create','--name',api,'--network',net,'--network-alias','beyond-platform-api','--env-file',str(stage_env),'--read-only','--tmpfs','/tmp:size=64m','--cap-drop','ALL','--security-opt','no-new-privileges:true',image,'node','apps/api/dist/main.js'],stdout=subprocess.DEVNULL)
run(['docker','network','connect','beyond-expertise_default',api]);run(['docker','start',api],stdout=subprocess.DEVNULL)
def ready(name,port,path):
 for _ in range(40):
  if subprocess.run(['docker','exec',name,'node','-e',"fetch('http://127.0.0.1:"+str(port)+path+"').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL).returncode==0:return
  time.sleep(2)
 raise RuntimeError('Health check failed: '+name)
def smoke(host,network,synthetic=False):
 cmd=['docker','run','--rm','--network',network,image,'node','deploy/ovh/smoke-campaign.cjs','http://'+host+':3300']
 if synthetic:cmd.append('isolated-stage')
 return json.loads(subprocess.check_output(cmd,text=True))
try:
 ready(api,4300,'/api/v1/campaigns/configuration')
 run(['docker','run','-d','--name',web,'--network',net,'--env-file',str(shared/'web.env'),'--workdir','/opt/beyond/apps/web','--cap-drop','ALL','--security-opt','no-new-privileges:true',image,'node','node_modules/next/dist/bin/next','start','--hostname','0.0.0.0','--port','3300'],stdout=subprocess.DEVNULL)
 ready(web,3300,'/afrique');stage_report=smoke(web,net,True);assert stage_report['status']=='PASS'
 print(json.dumps({'stage':stage_report,'preservedTables':len(before)}),flush=True)
 oldrelease=(root/'current').resolve();config=shared/'compose-production.env';previous=config.read_bytes()
 stamp=datetime.datetime.now(datetime.UTC).strftime('%Y%m%dT%H%M%SZ');rollback=shared/('campaign-rollback-'+stamp);rollback.mkdir(mode=0o700)
 (rollback/'compose-production.env').write_bytes(previous);(rollback/'compose-production.env').chmod(0o600);(rollback/'release.txt').write_text(str(oldrelease))
 (rollback/'deployment.json').write_bytes((shared/'deployment.json').read_bytes());(rollback/'deployment.json').chmod(0o600)
 run(['docker','run','--rm','--network','beyond-expertise_default','--env-file',str(shared/'api-production.env'),image,'node','node_modules/prisma/build/index.js','migrate','deploy'])
 lines=previous.decode().splitlines();assert sum(l.startswith('BEYOND_IMAGE=') for l in lines)==1
 config.write_text('\n'.join('BEYOND_IMAGE='+image if l.startswith('BEYOND_IMAGE=') else l for l in lines)+'\n');config.chmod(0o600)
 def compose(folder):return ['docker','compose','--env-file',str(config),'-f',str(folder/'deploy/ovh/docker-compose.production.yml'),'up','-d','--wait','--wait-timeout','180']
 try:
  run(compose(release));report=smoke('beyond-platform-web-1','beyond-platform_platform');assert report['status']=='PASS'
 except Exception:
  config.write_bytes(previous);run(compose(oldrelease));raise
 link=root/'current-campaign-next';assert not link.exists();link.symlink_to(release);link.replace(root/'current')
 meta=json.loads((shared/'deployment.json').read_text());meta.update({'deployedAt':datetime.datetime.now(datetime.UTC).isoformat(),'commit':sha,'image':image,'campaignFunnel':True,'campaignRollback':str(rollback),'smokePassed':True})
 (shared/'deployment.json').write_text(json.dumps(meta,indent=2));(shared/'deployment.json').chmod(0o600)
 report.update({'commit':sha,'image':image,'preservedStageTables':len(before),'backup':backup['backup'],'rollback':str(rollback),'stageDatabase':stage})
 (shared/'campaign-production-report.json').write_text(json.dumps(report,indent=2));print(json.dumps(report),flush=True)
finally:
 for name in [web,api]:subprocess.run(['docker','stop',name],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)

