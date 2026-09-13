from pathlib import Path
import json,re,unicodedata
from pypdf import PdfReader
import pdfplumber
import pypdfium2 as pdfium
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/"../../work/pdf-validation"
manifest=json.loads((OUT/"manifest.json").read_text(encoding="utf-8"))
def norm(s):return re.sub(r"\s+"," ",unicodedata.normalize("NFKC",s)).strip()
programmes=json.loads((ROOT/"data/detailed-programmes.json").read_text(encoding="utf-8"))["programmes"]
programmes += [c["syllabus"] for c in json.loads((ROOT/"data/regulatory-courses.json").read_text(encoding="utf-8"))["courses"]]
by_slug={p["slug"]:p for p in programmes}
problems=[]
for item in manifest:
 path=ROOT/item["file"];reader=PdfReader(path)
 text=norm(" ".join(p.extract_text() or "" for p in reader.pages))
 if "contact@beyondexpertise.eu" not in text:problems.append([path.name,"contact absent"])
 if path.parent.name=="programmes":
  p=by_slug[path.stem]
  for m in p["modules"]:
   for v in [m["title"],m["workshop"],m["practicalCheck"],*m["technicalDetails"]]:
    if norm(v) not in text:problems.append([path.name,"texte absent",v])
  if "certification non acquise" not in text:problems.append([path.name,"statut absent"])
 with pdfplumber.open(path) as pdf:
  for i,page in enumerate(pdf.pages):
   bad=[c for c in page.chars if c["text"].strip() and (c["x0"]<40 or c["x1"]>page.width-39 or c["top"]<10 or c["bottom"]>page.height-17)]
   if bad:problems.append([path.name,i+1,"hors marges",len(bad)])
samples=[
 "programmes/python-pour-data-analyst.pdf",
 "programmes/jdsa-spring-boot-et-angular-developper-des-applications-web-avec-spring-boot-et-angular.pdf",
 "programmes/conv-7-minutes-pour-convaincre.pdf",
 "reglementation/rgpd-support.pdf",
 "reglementation/ai-act-support.pdf",
 "reglementation/rgpd-modeles.pdf",
 "reglementation/ai-act-modeles.pdf",
]
for n,rel in enumerate(samples):
 pdf=pdfium.PdfDocument(str(ROOT/"apps/web/public"/rel))
 pages=sorted(set([0,min(1,len(pdf)-1),len(pdf)//2,len(pdf)-1]))
 sheet=Image.new("RGB",(1000,748*len(pages)//2+38),"#dce2e9")
 draw=ImageDraw.Draw(sheet);draw.text((10,8),rel,fill="black")
 for j,i in enumerate(pages):
  im=pdf[i].render(scale=1.5).to_pil().convert("RGB")
  if n==0 and i in (0,1):im.save(OUT/f"python-page-{i+1}.png")
  im.thumbnail((480,700))
  x=10+(j%2)*500;y=30+(j//2)*748
  sheet.paste(im,(x,y));draw.text((x,y+705),"Page "+str(i+1)+" / "+str(len(pdf)),fill="black")
 sheet.save(OUT/f"sample-{n+1}.png")
result={"status":"PASS" if not problems else "FAIL","pdfs":len(manifest),"programmes":len(programmes),"sequences":sum(len(p["modules"]) for p in programmes),"problems":problems}
(OUT/"audit.json").write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding="utf-8")
print(json.dumps({**result,"problems":problems[:8]},ensure_ascii=False))
if problems:raise SystemExit(1)
