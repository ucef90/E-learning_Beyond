"""Build the authorized Beyond release on its current OVH VPS."""
import pathlib,subprocess,socket,json,re,sys
assert socket.gethostname()=='vps-60dc9315'
sha=sys.argv[1];assert re.fullmatch('[a-f0-9]{40}',sha)
root=pathlib.Path('/home/ubuntu/beyond-platform');release=root/'releases'/sha[:7]
if not release.exists():
 subprocess.run(['git','clone','--filter=blob:none','--single-branch','--branch','codex/parcours-commercial-afrique','https://github.com/ucef90/E-learning_Beyond.git',str(release)],check=True)
assert subprocess.check_output(['git','-c','safe.directory='+str(release),'-C',str(release),'rev-parse','HEAD'],text=True).strip()==sha
log=root/'shared'/('build-'+sha[:7]+'.log');log.touch(mode=0o600)
with log.open('w') as out:
 subprocess.run(['docker','build','--label','org.opencontainers.image.revision='+sha,'-t','beyond-platform:'+sha[:7],'-f','deploy/ovh/Dockerfile','.'],cwd=release,stdout=out,stderr=subprocess.STDOUT,check=True)
print(json.dumps({'commit':sha,'image':'beyond-platform:'+sha[:7],'build':'PASS'}),flush=True)

