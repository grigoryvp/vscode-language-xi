export default function getEditorChangeHandler(ctx, key) {
  return function(e) {
    if (!e) return;
    if (!e.document) return;
    const filePath = e.document.fileName;
    if (filePath.endsWith('.xi')) {
      let history = ctx.globalState.get(key);
      if (!Array.isArray(history)) history = [];
      if (history.length > 100) history = history.slice(-100);
      history.push(filePath);
      ctx.globalState.update(key, history);
    }
  }
}
