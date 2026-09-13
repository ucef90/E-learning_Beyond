"""Export public syllabuses with complete module blocks and deliberate page breaks."""
import importlib.util,json
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
spec=importlib.util.spec_from_file_location('beyond_pdf',ROOT/'scripts/export-public-pdfs.py')
c=importlib.util.module_from_spec(spec);spec.loader.exec_module(c)
report=[]
for item in json.loads((ROOT/'content/professional/programmes.json').read_text(encoding='utf-8'))['programmes']:
    t=item['training'];p=item['syllabus']
    story=[c.para('PROGRAMME DE FORMATION · VERSION 1 · 13 SEPTEMBRE 2026','SmallBE'),c.para(t['title'],'TitleBE'),c.para(t['summary']),c.para(f"{t['durationDays']} jours équivalents · {p['totalHours']} heures · Hybride · Sur devis",'LabelBE'),c.heading('Public et prérequis'),c.para(t['audience']),c.para(t['prerequisites']),c.heading('Objectifs pédagogiques')]+[c.bullet(x) for x in t['objectives']]
    story += [c.heading('Votre projet fil rouge'),c.para(p['caseStudy']),c.heading('Organisation'),c.para(p['scheduleNote']),c.para(p['preparation'])]
    for offset in range(0,20,2):
        story += [c.PageBreak(),c.para(f"PROGRESSION · MODULES {offset+1} À {offset+2}",'SmallBE')]
        for i in range(offset,offset+2):
            m=p['modules'][i]
            story += [c.heading(f"{i+1}. {m['title']}"),c.para(f"Jour {m['day']} · {m['durationMinutes']} minutes, pratique et retours compris",'SmallBE')]+[c.bullet(x) for x in m['topics']]
            story+=c.labelled('Atelier',m['workshop'])+c.labelled('Livrable et vérification',m['deliverable']+' '+m['practicalCheck'])
    story += [c.PageBreak(),c.heading('Évaluation et accompagnement'),c.para(p['assessment']['format']),c.para(f"Évaluation finale : {p['assessment']['durationMinutes']} minutes indicatives, incluses dans le parcours.",'SmallBE')]+[c.bullet(x) for x in p['assessment']['criteria']]
    story += [c.heading('Méthodes et ressources'),c.para(p['methods']),c.para(p['materialsStatus']),c.heading('Modalités à confirmer avec le centre'),c.para('Positionnement, calendrier, tarif, accès aux supports et accompagnement convenus avant inscription. Pour un besoin d’accessibilité, indiquez le besoin pratique sans diagnostic médical. Contact : 09 54 70 23 80 · contact@beyondexpertise.eu.'),c.para('Programme à valider par le formateur avant animation. Aucun titre national, certification éditeur ou financement n’est garanti par ce document.','SmallBE'),c.heading('Références officielles')]+[c.bullet('['+r['title']+']('+r['url']+')') for r in p['references']]
    report.append(c.build(ROOT/'apps/web/public/programmes'/f"{t['slug']}.pdf",t['title'],story))
print(json.dumps(report))
