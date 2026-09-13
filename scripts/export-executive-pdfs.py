"""Public brochures generated from the website's original programme specifications."""
from pathlib import Path
import json, html, re
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader
import os
ROOT=Path(__file__).resolve().parents[1]
font=Path(os.environ.get('BEYOND_PDF_FONT_DIR','C:/Windows/Fonts'))
pdfmetrics.registerFont(TTFont('Beyond',str(font/'arial.ttf')))
pdfmetrics.registerFont(TTFont('BeyondBold',str(font/'arialbd.ttf')))
pdfmetrics.registerFontFamily('Beyond',normal='Beyond',bold='BeyondBold')
styles=getSampleStyleSheet()
for name,size,leading,bold,before,after in [('BodyBE',10,15,False,0,8),('SmallBE',8.5,12,False,0,7),('H1BE',25,30,True,12,18),('H2BE',15,20,True,18,10),('H3BE',11,16,True,12,7)]:
    styles.add(ParagraphStyle(name,fontName='BeyondBold' if bold else 'Beyond',fontSize=size,leading=leading,textColor=HexColor('#1a2644'),spaceBefore=before,spaceAfter=after,keepWithNext=bold))
def text(s):return html.escape(str(s).replace('\u2011','-').replace('\u2013','-').replace('\u2014','-'))
def p(s,style='BodyBE'):return Paragraph(text(s),styles[style])
def bullet(s):return Paragraph('• '+text(s),styles['BodyBE'])
def footer(c,doc):
    c.setStrokeColor(HexColor('#bd761c'));c.setLineWidth(2);c.line(44,811,551,811)
    c.setFont('BeyondBold',8);c.setFillColor(HexColor('#1a2644'));c.drawString(44,821,'BEYOND EXPERTISE / EXECUTIVE EDUCATION')
    c.setFont('Beyond',8);c.drawString(44,28,'Programme proposé - version du 13 septembre 2026');c.drawRightString(551,28,str(doc.page))
data=json.loads((ROOT/'content/executive/catalogue.json').read_text(encoding='utf-8'))
out=ROOT/'apps/web/public/programmes-executive';out.mkdir(parents=True,exist_ok=True)
report=[]
for item in data['programmes']:
    flow=[p(item['kind']+' / AFRIQUE & INTERNATIONAL','SmallBE'),p(item['title'],'H1BE'),p(item['promise']),p('Repères du parcours','H2BE'),p(f"Durée cible : {item['months']} - rythme indicatif : {item['pace']}"),p('Format proposé : à distance, avec classes virtuelles. Langue de travail : français.'),p(data['launchNote'],'SmallBE'),p('Public et prérequis','H2BE'),p(item['audience']),p(item['admission']),p('Objectifs observables','H2BE')]
    flow += [bullet(x) for x in item['outcomes']]
    flow += [PageBreak(),p('Programme détaillé','H1BE'),p('Chaque module ou jalon donne lieu à une production et à un retour pédagogique.')]
    for i,module in enumerate(item['modules'],1):
        block=[p(f"{i:02d}. {module['title']}",'H3BE')]+[bullet(x) for x in module['topics']]+[p('Livrable : '+module['deliverable'],'SmallBE'),Spacer(1,9)]
        flow.append(KeepTogether(block))
    flow += [PageBreak(),p('Projet, évaluation et candidature','H1BE'),p('Terrain d’application','H2BE'),p(item['caseStudy']),p(item['capstone']),p('Évaluations et reprises','H2BE'),p(item['assessment']),p('Organisation et financement','H2BE'),p('Le calendrier, les intervenants, les modalités d’accompagnement et le tarif sont confirmés avant inscription. Devis personnalisé ; financement employeur et échéancier à étudier. Aucune prise en charge ni éligibilité CPF garantie.'),p('Les besoins d’accessibilité et d’adaptation sont étudiés lors de l’entretien. Les données de terrain nécessitent une autorisation ; les usages d’IA sont déclarés et les sources citées.'),p('Statut du parcours et du titre visé','H2BE'),p(data['credentialNote'],'SmallBE'),p('Candidature sans paiement ni engagement','H2BE'),Paragraph('<link href="https://beyond-expertise.com/mba-dba/candidature?programme='+item['slug']+'" color="#8c520b">Présenter mon projet sur beyond-expertise.com</link>',styles['BodyBE']),p('Contact : contact@beyondexpertise.eu / +33 9 54 70 23 80','SmallBE')]
    target=out/(item['slug']+'.pdf')
    SimpleDocTemplate(str(target),pagesize=A4,rightMargin=44,leftMargin=44,topMargin=48,bottomMargin=48,title=item['kind']+' - '+item['title'],author='Beyond Expertise').build(flow,onFirstPage=footer,onLaterPages=footer)
    reader=PdfReader(target);extracted=' '.join(' '.join(x.extract_text().split()) for x in reader.pages)
    assert len(reader.pages)>=3 and item['title'] in extracted
    assert all(module['title'] in extracted for module in item['modules'])
    assert 'double diplomation' not in extracted.lower()
    report.append({'slug':item['slug'],'pages':len(reader.pages),'bytes':target.stat().st_size})
print(json.dumps({'pdfs':len(report),'pages':sum(x['pages'] for x in report),'largest':max(report,key=lambda p:p['bytes'])},ensure_ascii=False))
