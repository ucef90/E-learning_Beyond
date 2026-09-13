"""Build the 83 public syllabuses and four learning documents from the same sources as the site."""
from pathlib import Path
import html, json, re, os, sys
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, PageBreak
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "apps/web/public"
FONT = Path(os.environ.get("BEYOND_PDF_FONT_DIR", "C:/Windows/Fonts"))
for name, file in [("Beyond", "arial.ttf"), ("BeyondBold", "arialbd.ttf"), ("BeyondItalic", "ariali.ttf")]:
    pdfmetrics.registerFont(TTFont(name, str(FONT / file)))
pdfmetrics.registerFontFamily("Beyond", normal="Beyond", bold="BeyondBold", italic="BeyondItalic", boldItalic="BeyondBold")
NAVY = colors.HexColor("#1a2644")
ORANGE = colors.HexColor("#e89427")
GRAY = colors.HexColor("#526071")
styles = getSampleStyleSheet()
styles.add(ParagraphStyle("BodyBE", fontName="Beyond", fontSize=10, leading=14, spaceAfter=6, textColor=NAVY))
styles.add(ParagraphStyle("SmallBE", parent=styles["BodyBE"], fontSize=8.5, leading=12, textColor=GRAY))
styles.add(ParagraphStyle("TitleBE", parent=styles["BodyBE"], fontName="BeyondBold", fontSize=23, leading=28, spaceAfter=16))
styles.add(ParagraphStyle("H2BE", parent=styles["BodyBE"], fontName="BeyondBold", fontSize=15, leading=20, spaceBefore=16, spaceAfter=9, keepWithNext=True))
styles.add(ParagraphStyle("H3BE", parent=styles["BodyBE"], fontName="BeyondBold", fontSize=11.5, leading=16, spaceBefore=10, spaceAfter=7, keepWithNext=True))
styles.add(ParagraphStyle("BulletBE", parent=styles["BodyBE"], leftIndent=12, firstLineIndent=-9, spaceAfter=5))
styles.add(ParagraphStyle("LabelBE", parent=styles["SmallBE"], fontName="BeyondBold", spaceBefore=7, keepWithNext=True))
WIDTH, HEIGHT = A4
def clean(s):
    return html.unescape(str(s)).replace("\u00a0"," ").replace("\u202f"," ")
def rich(s):
    s = html.escape(clean(s))
    s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"`([^`]+)`", r"\1", s)
    def link(m):
        label, url = m.group(1), html.unescape(m.group(2))
        if url.startswith(("https://", "mailto:", "tel:")):
            return '<a href="' + html.escape(url, quote=True) + '" color="#1d5780">' + label + '</a>'
        return label
    return re.sub(r"\[([^]]+)\]\(([^)]+)\)", link, s)
def para(s, style="BodyBE"):
    return Paragraph(rich(s), styles[style])
def bullet(s):
    return Paragraph("• " + rich(s), styles["BulletBE"])
def heading(s):
    return para(s, "H2BE")
def labelled(label, body):
    return [para(label, "LabelBE"), para(body)]
def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(ORANGE); canvas.setLineWidth(2)
    canvas.line(44, HEIGHT-31, WIDTH-44, HEIGHT-31)
    canvas.setFillColor(NAVY); canvas.setFont("BeyondBold", 9)
    canvas.drawString(44, HEIGHT-23, "BEYOND EXPERTISE")
    canvas.setFillColor(GRAY); canvas.setFont("Beyond", 8)
    canvas.drawRightString(WIDTH-44, HEIGHT-23, "Programme & ressources pédagogiques")
    canvas.setStrokeColor(colors.HexColor("#d9dfe7")); canvas.setLineWidth(.5)
    canvas.line(44, 42, WIDTH-44, 42)
    canvas.setFont("Beyond", 7.7)
    canvas.drawString(44, 29, "09 54 70 23 80  ·  contact@beyondexpertise.eu")
    canvas.drawRightString(WIDTH-44, 29, str(doc.page))
    canvas.restoreState()
def build(path, title, story):
    path.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(path), pagesize=A4, rightMargin=44, leftMargin=44, topMargin=52, bottomMargin=55,
        title=clean(title), author="Beyond Expertise", subject="Formation et programme pédagogique", pageCompression=1)
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    reader = PdfReader(str(path))
    assert len(reader.pages) > 0
    text = "\n".join(p.extract_text() or "" for p in reader.pages)
    assert ".md" not in text and "Rédaction assistée par IA" not in text
    return {"file":str(path.relative_to(ROOT)).replace("\\","/"),"pages":len(reader.pages),"bytes":path.stat().st_size}

def programme(t, p):
    story = [para("PROGRAMME DE FORMATION · VERSION " + str(p["version"]) + " · " + p["authoredAt"],"SmallBE"),
             para(t["title"],"TitleBE"), para(p.get("overview",t["summary"]))]
    band = [[para(str(t["durationDays"])+" jours · "+str(p["totalHours"])+" heures","SmallBE"),
             para(t["level"]+" · "+t["format"],"SmallBE"),
             para(t.get("observedPrice") or "Sur devis","SmallBE")]]
    tb = Table(band, colWidths=[155,185,WIDTH-88-340])
    tb.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),colors.HexColor("#f1f4f8")),("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),10),("RIGHTPADDING",(0,0),(-1,-1),10),("TOPPADDING",(0,0),(-1,-1),12),("BOTTOMPADDING",(0,0),(-1,-1),7)]))
    story += [Spacer(1,10),tb,para("Tarif indicatif, dates, disponibilité et modalités contractuelles à confirmer avec le centre.","SmallBE")]
    story += [heading("À qui s’adresse cette formation ?"),para(p.get("audience") or t.get("audience") or "À préciser avec le centre.")]
    story += labelled("Prérequis",p.get("prerequisites") or t.get("prerequisites") or p["preparation"])
    story += [heading("Objectifs pédagogiques")] + [bullet(o) for o in t["objectives"]]
    story += [heading("Le cas fil rouge"),para(p["caseStudy"])]
    story += labelled("Préparation",p["preparation"])
    story += [heading("Progression détaillée"),para(p["scheduleNote"],"SmallBE")]
    for day in sorted(set(m["day"] for m in p["modules"])):
        story += [heading("Jour "+str(day)+" · 7 heures")]
        for i,m in enumerate(p["modules"]):
            if m["day"] != day: continue
            story += [para(str(i+1)+". "+m["title"],"H3BE"),para(str(m["durationMinutes"])+" minutes · apports, exercice et retour","SmallBE")]
            story += [bullet(s) for s in m["topics"]]
            story += [para("NOTIONS ET MÉTHODES EN DÉTAIL","LabelBE")]
            story += [bullet(s) for s in m.get("technicalDetails",[])]
            story += labelled("Atelier prévu",m["workshop"])
            story += labelled("Livrable attendu",m.get("deliverable",""))
            story += labelled("Vérification en atelier",m.get("practicalCheck",""))
            story += labelled("Pour aller plus loin · selon positionnement et temps disponible",m.get("expertChallenge",""))
    story += [heading("Évaluation finale"),para(p["assessment"]["format"]+" Durée indicative : "+str(p["assessment"]["durationMinutes"])+" minutes.")]
    story += [bullet(c) for c in p["assessment"]["criteria"]]
    story += [heading("Méthodes et ressources"),para(p["methods"]),para(p["materialsStatus"])]
    story += [heading("Accès, accompagnement et contact"),para("Pour obtenir plus de détails ou le programme détaillé validé, contactez le centre : 09 54 70 23 80 — contact@beyondexpertise.eu."),
       para("Positionnement et vérification des prérequis avant inscription. Délais, calendrier et aménagements à convenir avec le centre. Pour un besoin d’accessibilité, décrivez le besoin pratique sans diagnostic médical."),
       para("Programme enrichi proposé, à valider par le formateur avant animation. Les approfondissements sont adaptés au niveau et au temps disponible. Aucune certification professionnelle ni prise en charge CPF ou OPCO n’est garantie. Démarche Qualiopi en cours ; certification non acquise.","SmallBE"),
       ]
    if p["references"]: story.append(heading("Références pour approfondir"))
    story += [bullet("["+r["title"]+"]("+r["url"]+")") for r in p["references"]]
    return story

def markdown_story(text):
    story=[]
    lines=text.strip().splitlines()
    i=0
    while i<len(lines):
        line=lines[i].strip();i+=1
        if not line or line==":::":continue
        if line.startswith(":::details"):
            story.append(para(line.replace(":::details","").strip(),"H3BE"));continue
        m=re.match(r"^(#{1,6})\s+(.*)",line)
        if m:
            story.append(para(m[2],"H2BE" if len(m[1])<=2 else "H3BE"));continue
        if line.startswith("|"):
            table_lines=[line]
            while i<len(lines) and lines[i].strip().startswith("|"):
                table_lines.append(lines[i].strip());i+=1
            rows=[[v.strip() for v in l.strip("|").split("|")] for l in table_lines]
            rows=[r for r in rows if not all(re.fullmatch(r"[: -]+",v or "-") for v in r)]
            if not rows:continue
            if len(rows[0])>2:
                rows=[["Champ du dossier","À compléter"]]+[[v,""] for v in rows[0]]
            cells=[[para(v,"SmallBE") for v in row] for row in rows]
            widths=[(WIDTH-88)*.46,(WIDTH-88)*.54]
            tb=Table(cells,colWidths=widths,repeatRows=1,hAlign="LEFT")
            tb.setStyle(TableStyle([
              ("BACKGROUND",(0,0),(-1,0),colors.HexColor("#edf2f7")),
              ("GRID",(0,0),(-1,-1),.4,colors.HexColor("#cbd5e1")),
              ("VALIGN",(0,0),(-1,-1),"TOP"),
              ("LEFTPADDING",(0,0),(-1,-1),9),("RIGHTPADDING",(0,0),(-1,-1),9),
              ("TOPPADDING",(0,0),(-1,-1),9),("BOTTOMPADDING",(0,0),(-1,-1),9),
            ]))
            story.extend([tb,Spacer(1,12)]);continue
        if re.match(r"^[-*]\s|^\d+\.\s",line):
            story.append(bullet(re.sub(r"^[-*]\s|^\d+\.\s","",line)));continue
        paragraph=[line]
        while i<len(lines) and lines[i].strip() and not re.match(r"^(#|\||[-*] |\d+\. |:::)",lines[i].strip()):
            paragraph.append(lines[i].strip());i+=1
        story.append(para(" ".join(paragraph)))
    return story

def main():
    catalogue=json.loads((ROOT/"data/official-catalogue.json").read_text(encoding="utf-8"))["trainings"]
    programmes=json.loads((ROOT/"data/detailed-programmes.json").read_text(encoding="utf-8"))["programmes"]
    regulatory=json.loads((ROOT/"data/regulatory-courses.json").read_text(encoding="utf-8"))["courses"]
    pairs=[(t,next(p for p in programmes if p["slug"]==t["slug"])) for t in catalogue]+[(c["training"],c["syllabus"]) for c in regulatory]
    reports=[]
    for t,p in pairs:
        reports.append(build(PUBLIC/"programmes"/(t["slug"]+".pdf"),t["title"],programme(t,p)))
    for c in regulatory:
        title=c["title"]
        support=[para("SUPPORT & CAS CORRIGÉS · 13 SEPTEMBRE 2026","SmallBE"),para(title,"TitleBE"),
          para("Support pédagogique Beyond Expertise. Validation du formateur à réaliser avant animation ; aucune certification officielle revendiquée.","SmallBE"),
          heading("Mode d’emploi"),para(c["syllabus"]["scheduleNote"]),para(c["syllabus"]["methods"]),
          heading("Positionnement")]+[bullet(q) for q in c["initialQuestions"]]+[heading("Cas fil rouge"),para(c["caseStudy"])]
        for i in range(8):
            l=json.loads((ROOT/f"content/regulatory/{c['code']}/0{i+1}.json").read_text(encoding="utf-8"))
            support += [heading("Séquence "+str(i+1)+" · "+l["title"]),para(l["articles"],"SmallBE")]
            support += markdown_story(l["body"])
            support += [para("Mise en pratique","H3BE"),para(l["exercise"]),para("Corrigé pédagogique","H3BE"),para(l["solution"])]
        support += [heading("Quiz formatif et corrigé")]
        for i,q in enumerate(c["quiz"]):
            support += [para(str(i+1)+". "+q["prompt"],"H3BE")]+[bullet(str(j+1)+". "+o) for j,o in enumerate(q["options"])]
            support += [para("Réponse "+str(q["correct"]+1)+". "+q["explanation"])]
        support += [heading("Sources")]+[bullet("["+r["title"]+"]("+r["url"]+")") for r in c["references"]]
        reports.append(build(PUBLIC/"reglementation"/(c["code"]+"-support.pdf"),title+" — support",support))
        models=(ROOT/f"content/regulatory/{c['code']}/modeles.md").read_text(encoding="utf-8")
        reports.append(build(PUBLIC/"reglementation"/(c["code"]+"-modeles.pdf"),title+" — modèles",
            [para("CARNET DE MODÈLES · 13 SEPTEMBRE 2026","SmallBE"),para(title,"TitleBE")]+markdown_story(models)))
    assert len(reports)==87
    out=ROOT/"../../work/pdf-validation"
    out.mkdir(parents=True,exist_ok=True)
    (out/"manifest.json").write_text(json.dumps(reports,ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps({"status":"PASS","pdf":len(reports),"pages":sum(r["pages"] for r in reports)}))
if __name__=="__main__": main()
