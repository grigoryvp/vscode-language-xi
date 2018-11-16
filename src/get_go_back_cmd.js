const tools = require('./tools.js');


module.exports = function(vscode, ctx, key) {
  return function() {
    const history = ctx.globalState.get(key);
    if (Array.isArray(history) && history.length > 1) {
      //  Current file.
      history.pop();
      //  Previous file
      const filePath = history.pop();
      ctx.globalState.update(key, history);
      const uri = vscode.Uri.file(filePath);
      vscode.workspace.openTextDocument(uri).then(doc => {
        vscode.window.showTextDocument(doc);
      });
    }
  }
}
