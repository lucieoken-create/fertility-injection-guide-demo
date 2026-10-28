"""Build a self-contained static demo using reviewed local sources only."""
from pathlib import Path
import json, hashlib, base64
ROOT=Path(__file__).resolve().parent
plan=json.loads((ROOT/'example-plan.json').read_text())
art=json.loads((ROOT/'assets/illustrations.json').read_text())
def script_json(value):
    return json.dumps(value,ensure_ascii=False).replace('<','\\u003c')
script='const demo='+script_json(plan)+';\nconst art='+script_json(art)+';\n'+(ROOT/'app.js').read_text()+'\n'+(ROOT/'celebration.js').read_text()
digest=base64.b64encode(hashlib.sha256(script.encode()).digest()).decode()
html=(ROOT/'index.template.html').read_text().replace('{{CSS}}',(ROOT/'styles.css').read_text()).replace('{{SCRIPT}}',script).replace('{{SCRIPT_HASH}}',digest)
(ROOT/'index.html').write_text(html)
print('Built index.html with embedded assets and a verified script hash.')
