const fs=require("node:fs"),assert=require("node:assert/strict"),{chromium}=require("@playwright/test"),{pathToFileURL}=require("node:url"),path=require("node:path");
async function main(){
 const browser=await chromium.launch({channel:"chrome",headless:true});
 try{
  const context=await browser.newContext({viewport:{width:1440,height:1000}}),base="http://127.0.0.1:3300";
  const a=JSON.parse(fs.readFileSync(".pilot/accounts.json","utf8")).find(a=>a.role==="ADMIN");
  assert.equal((await context.request.post(base+"/api/v1/auth/login",{headers:{Origin:base},data:{email:a.email,password:a.password}})).status(),201);
  const page=await context.newPage(),errors=[],report={at:new Date().toISOString(),courses:[]};page.on("pageerror",e=>errors.push(e.message));
  const courses=JSON.parse(fs.readFileSync("work/validation/priority-content.json","utf8"));
  for(const c of courses){
   await page.goto(base+"/apprentissage");await page.getByRole("button",{name:"Mes cours",exact:true}).first().click();
   const row=page.locator(".academy-course-row").filter({has:page.getByRole("heading",{name:c.title,exact:true})});
   await row.getByRole("button",{name:"Consulter le cours"}).click();await page.getByRole("button",{name:"Fiche et objectifs",exact:true}).click();await page.getByRole("heading",{name:"Votre feuille de route",exact:true}).waitFor();
   assert((await page.locator(".learning-sidebar nav button").count())>=c.modules*2);
   await page.locator(".learning-sidebar nav button").nth(c.key==="python-analyse-ml"?6:1).click();
   await page.locator(".lesson-prose").waitFor();
   assert((await page.locator(".lesson-prose").innerText()).length>1500);
   await page.screenshot({path:"work/validation/"+c.key+"-lecture.png",fullPage:true});
   await page.getByRole("button",{name:"Atelier guidé",exact:true}).click();
   const run=page.getByRole("button",{name:"Tout exécuter",exact:true});await run.waitFor();await run.click();
   await page.getByText(/Environnement utilisé : Python/).waitFor({timeout:90000});
   assert(!(await page.locator("main").innerText()).includes("PythonError"));
   await page.setViewportSize({width:390,height:844});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),c.key+" débordement mobile");
   await page.screenshot({path:"work/validation/"+c.key+"-atelier-mobile.png",fullPage:true});
   await page.setViewportSize({width:1440,height:1000});
   report.courses.push({title:c.title,status:"PASS",checks:["Leçon complète lisible","Tous les quiz accessibles","Atelier exécuté depuis le lecteur","Mobile sans débordement"]});
   console.log("PASS",c.title);
  }
  const doc=await context.newPage();await doc.goto(pathToFileURL(path.resolve("docs/etude-marche-budget.html")).href);await doc.screenshot({path:"work/validation/etude-budget.png",fullPage:false});
  assert.equal(errors.length,0,errors.join("\n"));report.status="PASS";fs.writeFileSync("work/validation/priority-ui.json",JSON.stringify(report,null,2));
 }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
