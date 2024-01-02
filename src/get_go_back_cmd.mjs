export default function getGoBackCmf(vscode, ctx, key) {
  return function() {
    const history = ctx.globalState.get(key);
    if (Array.isArray(history) && history.length > 1) {
      //  Current file.
      history.pop();
      //  Previous file
      const filePath = history[history.length - 1];
      ctx.globalState.update(key, history);
      const uri = vscode.Uri.file(filePath);
      vscode.workspace.openTextDocument(uri).then(doc => {
        vscode.window.showTextDocument(doc);
      });
    }
  }
}
