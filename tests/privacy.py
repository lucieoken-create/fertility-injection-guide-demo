"""Scan the reviewed allowlist and every Git-history blob without network access."""
from pathlib import Path
import re,json,subprocess,hashlib,base64
ROOT=Path(__file__).resolve().parents[1]
ALLOWED={'.gitignore','README.md','app.js','assets/illustrations.json','build.py','celebration.js','example-plan.json','index.html','index.template.html','serve.py','styles.css','tests/privacy.py','tests/browser.mjs','CONTENT-SOURCES.md'}
files={p.relative_to(ROOT).as_posix() for p in ROOT.rglob('*') if p.is_file() and '.git' not in p.relative_to(ROOT).parts and '__pycache__' not in p.parts}
assert files==ALLOWED,('Unexpected or missing files',sorted(files^ALLOWED))
patterns={
 'email address':r'\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b',
 'phone number':r'(?<!\d)\d{3}[-.]\d{3}[-.]\d{4}(?!\d)',
 'calendar date':r'\b20\d{2}-\d{2}-\d{2}\b',
 'specific medication quantity':r'\b\d+(?:\.\d+)?\s*(?:units|mcg|mg|ml|powder vials?)\b',
 'external account or source link':r'https?://(?!127\.0\.0\.1(?::\d+)?(?:/|\b)|localhost(?::\d+)?(?:/|\b))[^\s<>"\x27]+',
 'secret material':r'-----BEGIN [A-Z ]*PRIVATE KEY-----|\b(?:ghp_|github_pat_|sk_live_)[A-Za-z0-9_]+'
}
PUBLIC_SOURCES=[
 'https://www.youtube.com/watch?v=AEd0NsCXkrw',
 'https://www.youtube.com/watch?v=KP12maxV8Gs',
 'https://www.youtube.com/watch?v=60DBBFIzXkk',
 'https://www.organon.com/product/usa/pi_circulars/f/follistim_aq_cartridge/follistim_cartridge_ppiifu.pdf',
 'https://www.menopur.com/wp-content/uploads/2023/12/Menopur-Injection-Guide_English.pdf'
]
def scan(name,data):
 text=data.decode('utf-8').replace('http://www.w3.org/2000/svg','')
 for source in PUBLIC_SOURCES:text=text.replace(source,'PUBLIC_SOURCE')
 for label,pattern in patterns.items():assert not re.search(pattern,text,re.I),(name,label)
for name in sorted(files):scan(name,(ROOT/name).read_bytes())
plan=json.loads((ROOT/'example-plan.json').read_text());assert plan['namespace']=='fertility-portfolio-demo-v1'
for med in plan['medications'].values():
 assert med['dose']=='[Prescribed dose]' and med['schedule']=='[Prescribed schedule]'
 assert all(s.get('placeholder','[').startswith('[') for s in med['steps'])
 assert all(any(s['sourceUrl'].startswith(url) for url in PUBLIC_SOURCES) for s in med['steps'])
 assert all(s.get('diagram','') in {'','follistimAngle','menopurAngle','ganirelixAngle'} for s in med['steps'])
html=(ROOT/'index.html').read_text();script=re.search(r'<script>(.*?)</script>',html,re.S).group(1)
assert "script-src 'sha256-"+base64.b64encode(hashlib.sha256(script.encode()).digest()).decode()+"'" in html
assert 'Not for treatment decisions.' in html
assert not re.search(r'localStorage|sessionStorage|indexedDB|document\.cookie|navigator\.sendBeacon|fetch\(', (ROOT/'app.js').read_text())
assert not re.search(r'<(?:iframe|img)\b|<script[^>]+src=',html,re.I)
assert '{{SCRIPT}}' not in html
history_blobs=0
if (ROOT/'.git').exists():
 tracked=set(subprocess.check_output(['git','ls-files'],cwd=ROOT,text=True).splitlines());assert tracked==ALLOWED
 assert subprocess.check_output(['git','remote'],cwd=ROOT,text=True).strip()==''
 if subprocess.run(['git','rev-parse','--verify','HEAD'],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL).returncode==0:
  for line in subprocess.check_output(['git','rev-list','--objects','--all'],cwd=ROOT,text=True).splitlines():
   oid=line.split()[0]
   if subprocess.check_output(['git','cat-file','-t',oid],cwd=ROOT,text=True).strip()=='blob':scan('history blob '+oid,subprocess.check_output(['git','cat-file','blob',oid],cwd=ROOT));history_blobs+=1
print(json.dumps({'files_scanned':len(files),'history_blobs_scanned':history_blobs,'personal_dose_schedule_placeholders':True,'CSP_verified':True,'no_storage':True,'no_remote':True}))
