"""Install only the pinned Pyodide runtime and packages required by the pilot.
Download over verified HTTPS; verify wheel SHA-256 against the distribution lock.
No learner file or credential is sent to these hosts.
"""
from pathlib import Path
import urllib.request, json, hashlib, tarfile, io, re
from concurrent.futures import ThreadPoolExecutor
ROOT=Path(__file__).resolve().parents[1]
DEST=ROOT/'apps/web/public/lab-assets'
VERSION='0.27.7'
CORE_SHA256='9bc8f127db6c590b191b9aee754022cb41b1a36c7bac233776c11c5ecb541be8'
BASE=f'https://cdn.jsdelivr.net/pyodide/v{VERSION}/full/'
CORE=f'https://github.com/pyodide/pyodide/releases/download/{VERSION}/pyodide-core-{VERSION}.tar.bz2'
def fetch(url):
    with urllib.request.urlopen(url,timeout=120) as response: return response.read()
def main():
    DEST.mkdir(parents=True,exist_ok=True)
    core=fetch(CORE)
    if hashlib.sha256(core).hexdigest()!=CORE_SHA256: raise ValueError("Core integrity mismatch")
    with tarfile.open(fileobj=io.BytesIO(core),mode='r:bz2') as archive:
        for member in archive.getmembers():
            if not member.isfile(): continue
            name=Path(member.name).name
            if not re.fullmatch(r'[A-Za-z0-9_.-]+',name): raise ValueError('Unsafe archive member')
            (DEST/name).write_bytes(archive.extractfile(member).read())
    lock=json.loads((DEST/'pyodide-lock.json').read_text()) if (DEST/'pyodide-lock.json').exists() else json.loads(fetch(BASE+'pyodide-lock.json'))
    (DEST/'pyodide-lock.json').write_text(json.dumps(lock),encoding='utf-8')
    selected={}
    def visit(name):
        if name in selected:return
        pkg=lock['packages'][name];selected[name]=pkg
        for dep in pkg.get('depends',[]):visit(dep)
    for name in ['pandas','matplotlib','sqlite3']:visit(name)
    def install(item):
        name,pkg=item;filename=pkg['file_name']
        if not re.fullmatch(r'[A-Za-z0-9_.+-]+',filename):raise ValueError('Unsafe wheel name')
        target=DEST/filename
        data=target.read_bytes() if target.exists() else fetch(BASE+filename)
        if hashlib.sha256(data).hexdigest()!=pkg['sha256']:raise ValueError('Integrity mismatch: '+name)
        target.write_bytes(data)
        return {'package':name,'version':pkg['version'],'file':filename,'bytes':len(data),'sha256':pkg['sha256']}
    with ThreadPoolExecutor(max_workers=4) as pool: packages=list(pool.map(install,selected.items()))
    manifest={'version':VERSION,'coreSource':CORE,'coreSha256':hashlib.sha256(core).hexdigest(),'packages':packages,'totalBytes':sum(p.stat().st_size for p in DEST.iterdir() if p.is_file())}
    (DEST/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
    print(json.dumps(manifest,indent=2))
if __name__=='__main__':main()
