const {chromium}=require('@playwright/test');
const {PrismaClient}=require('@prisma/client');
const fs=require('node:fs');const assert=require('node:assert/strict');
const root='.';const checks=[];let b;const db=new PrismaClient();
async function check(name,fn){await fn();checks.push({name,status:'PASS'});console.log('PASS',name);}
async function main(){
 if(!new URL(process.env.DATABASE_URL).pathname.endsWith('/beyond_pilot'))throw Error('Base synthétique requise');
 await check('Une formation non publiée est inaccessible par son slug',async()=>{const t=await db.training.create({data:{slug:'controle-prive-'+Date.now(),title:'Formation privée de recette',summary:'Contrôle de publication',objectives:[],durationDays:1,level:'FOUNDATION',format:'ELEARNING'}});try{const r=await fetch('http://127.0.0.1:3200/api/v1/trainings/'+t.slug);assert.equal(r.status,404);}finally{await db.training.delete({where:{id:t.id}});}});
 const a=JSON.parse(fs.readFileSync(root+'/.pilot/accounts.json','utf8')).find(a=>a.email==='stagiaire@pilot.invalid');
 b=await chromium.launch({headless:true,channel:'chrome'});const p=await b.newPage({viewport:{width:1440,height:1000}});p.setDefaultTimeout(20000);
 await p.goto('http://127.0.0.1:3200/connexion');await p.getByLabel('Adresse e-mail',{exact:true}).fill(a.email);await p.getByLabel('Mot de passe',{exact:true}).fill(a.password);await p.getByRole('button',{name:'Se connecter',exact:true}).click();
 await p.locator('.learning-course-card').filter({has:p.getByRole('heading',{name:'Analyser un fichier de ventes avec Python et pandas',exact:true})}).getByRole('button',{name:'Ouvrir mon module'}).click();await p.locator('.lesson-prose').waitFor();
 await p.screenshot({path:'../../outputs/validation-elearning/module-pilote.png',fullPage:false});
 await p.getByRole('button',{name:'TP · Pratiquer sur les ventes',exact:true}).click();const code=p.getByLabel('Code Python cellule 2',{exact:true});await code.waitFor();
 await check('Une navigation annulée conserve le notebook non sauvegardé',async()=>{await code.fill((await code.inputValue())+'\n# Vérification de reprise');p.once('dialog',d=>d.dismiss());await p.getByRole('button',{name:'Fiche et objectifs',exact:true}).click();assert.ok((await code.inputValue()).includes('Vérification de reprise'));});
 await check('Sauvegarde et réouverture du brouillon dans le lecteur',async()=>{await p.getByRole('button',{name:'Sauvegarder sur le serveur',exact:true}).click();await p.getByRole('status').filter({hasText:'Sauvegardé sur le serveur'}).waitFor();await p.getByRole('button',{name:'Fiche et objectifs',exact:true}).click();await p.getByRole('button',{name:'TP · Pratiquer sur les ventes',exact:true}).click();await code.waitFor();assert.ok((await code.inputValue()).includes('Vérification de reprise'));});
 await check('Quiz rempli dans le navigateur et feedback explicatif accessible',async()=>{await p.getByRole('button',{name:'Quiz · Vérifier mes acquis',exact:true}).click();const questions=p.locator('.quiz-question');assert.equal(await questions.count(),10);for(let i=0;i<10;i++)await questions.nth(i).getByRole('radio').first().check();await p.getByRole('button',{name:'Valider mes réponses',exact:true}).click();await p.getByRole('status').filter({hasText:'Quiz évalué'}).waitFor();const result=p.locator('details.learning-result').first();await result.getByRole('button').count();await result.locator('summary').click();assert.equal(await result.locator('h4').count(),10);});
 await b.close();b=null;
}
main().catch(e=>{console.error(e.stack);checks.push({name:'Échec',status:'FAIL',error:e.stack});process.exitCode=1;}).finally(async()=>{if(b)await b.close();await db.$disconnect();fs.writeFileSync('../../outputs/validation-elearning/finitions.json',JSON.stringify({date:new Date().toISOString(),checks},null,2));});
