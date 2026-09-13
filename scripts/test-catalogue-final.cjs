const fs=require("node:fs"),assert=require("node:assert/strict"),{chromium}=require("@playwright/test"),{load}=require("cheerio");
const base="http://127.0.0.1:3300";
async function main(){
 const catalogue=await (await fetch(base+"/api/v1/trainings")).json();assert.equal(catalogue.length,83);
 const titles=new Set(),report={at:new Date().toISOString(),pages:[],clicks:[]};
 for(const c of catalogue){
  const res=await fetch(base+"/formations/"+c.slug);const text=await res.text(),$=load(text);
  assert.equal(res.status,200,c.slug);assert.equal($("h1").first().text(),c.title,c.slug);
  assert(!$("body").text().includes("Ce contenu est temporairement indisponible"),c.slug);
  const title=$("title").text();assert(title.includes(c.title));assert(!titles.has(title));titles.add(title);
  assert($('meta[name="description"]').attr("content")?.length>30);
  assert(res.headers.get("x-robots-tag")?.includes("noindex"));
  assert(!$('a[href$=".md"]').length,"Téléchargement Markdown public");
  assert(!/Ã|â€/.test($("main").text()),"Encodage de la fiche "+c.slug);
  report.pages.push({slug:c.slug,status:res.status,title});
 }
 assert.equal((await fetch(base+"/formations/formation-absente-recette")).status,404);
 assert((await (await fetch(base+"/robots.txt")).text()).includes("Disallow: /"));
 assert(!(await (await fetch(base+"/sitemap.xml")).text()).includes("<loc>"));
 const browser=await chromium.launch({channel:"chrome",headless:true});
 try {
  const page=await browser.newPage(),errors=[];page.on("pageerror",e=>errors.push(e.message));
  await page.goto(base+"/formations");await page.locator('a[href^="/formations/"]').first().waitFor();
  const links=[...new Set(await page.locator('a[href^="/formations/"]').evaluateAll(a=>a.map(x=>x.getAttribute("href"))))].filter(h=>catalogue.some(c=>h==="/formations/"+c.slug)).slice(0,40);
  assert(links.length>=8,"Nombre insuffisant de liens catalogue");
  for(const href of links){
   await page.locator('a[href="'+href+'"]').first().click();await page.waitForURL("**"+href);
   const t=catalogue.find(c=>href==="/formations/"+c.slug);await page.getByRole("heading",{level:1,name:t.title,exact:true}).waitFor();
   report.clicks.push(href);await page.goBack();await page.locator('a[href="'+href+'"]').first().waitFor();
  }
  assert.equal(errors.length,0,errors.join("\n"));
  report.status="PASS";fs.writeFileSync("work/validation/catalogue-final.json",JSON.stringify(report,null,2));
  console.log(JSON.stringify({status:"PASS",pages:report.pages.length,clicks:report.clicks.length,uniqueTitles:titles.size,noindex:true,unknown404:true}));
 }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
