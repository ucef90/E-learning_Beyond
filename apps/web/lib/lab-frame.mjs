// Separate sandbox origin: the Python worker has no access to the application's cookies or DOM.
// No notebook is executed until the learner explicitly presses Run.
const worker = `
let py, log = "";
self.onmessage = async ({data}) => {
  try {
    if (!py) {
      self.postMessage({type:"status",text:"Chargement de Python, pandas et matplotlib…"});
      const { loadPyodide } = await import("__LAB_BASE__pyodide.mjs");
      py = await loadPyodide({indexURL:"__LAB_BASE__"});
      await py.loadPackage(["pandas","matplotlib","sqlite3"]);
    }
    log = "";
    py.setStdout({batched:text=>{log=(log+text+"\\n").slice(0,50000)}});
    py.setStderr({batched:text=>{log=(log+text+"\\n").slice(0,50000)}});
    py.FS.writeFile("ventes.csv", data.csv);
    const globals=py.runPython("dict(__name__='__main__')");
    try {
      await py.runPythonAsync("import matplotlib\\nmatplotlib.use('agg')\\nimport matplotlib.pyplot as plt\\nplt.close('all')",{globals});
      await py.runPythonAsync(data.code,{globals});
      const plots = await py.runPythonAsync("import io, base64, json\\n_images=[]\\nfor _n in plt.get_fignums()[:5]:\\n    _b=io.BytesIO()\\n    plt.figure(_n).savefig(_b,format='png',dpi=100,bbox_inches='tight')\\n    _images.append(base64.b64encode(_b.getvalue()).decode())\\njson.dumps(_images)",{globals});
      const versions=py.runPython("import sys,pandas,matplotlib,json;json.dumps({'python':sys.version.split()[0],'pandas':pandas.__version__,'matplotlib':matplotlib.__version__})");
      self.postMessage({type:"result",text:log||"Exécution terminée sans sortie texte.",plots:JSON.parse(plots),versions:JSON.parse(versions)});
    } finally { globals.destroy(); }
  } catch(e) { self.postMessage({type:"error",text:log+"\\n"+String(e).slice(0,10000)}); }
};`;
export function labFrame(origin) {
  const assetBase = new URL(origin).origin + "/lab-assets/";
  return `<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'wasm-unsafe-eval' blob: ${assetBase}; worker-src blob:; connect-src ${assetBase}; img-src data:;"></head><body><script>
const url=URL.createObjectURL(new Blob([${JSON.stringify(worker.replaceAll("__LAB_BASE__", assetBase))}],{type:'text/javascript'}));
const w=new Worker(url,{type:'module'});
w.onmessage=e=>parent.postMessage(e.data,'*');
w.onerror=e=>parent.postMessage({type:'error',text:'Le laboratoire ne peut pas démarrer : '+e.message},'*');
addEventListener('message',e=>{if(e.source===parent && e.data.type==='run') w.postMessage(e.data);});
parent.postMessage({type:'ready'},'*');
</script></body></html>`;
}
