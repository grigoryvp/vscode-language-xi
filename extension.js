const vscode = require('vscode');
const geLinkProvider = require('./get_link_provider.js');


const HISTORY_KEY = 'file-history';


module.exports.activate = function(ctx) {
  const regProvider = vscode.languages.registerDocumentLinkProvider;
  const LinkProvider = geLinkProvider(vscode);
  ctx.subscriptions.push(regProvider('xi', new LinkProvider()));
  vscode.window.onDidChangeActiveTextEditor(e => {
    if (!e) return;
    if (!e.document) return;
    const filePath = e.document.fileName;
    if (filePath.endsWith('.xi')) {
      let history = ctx.globalState.get(HISTORY_KEY);
      if (!Array.isArray(history)) history = [];
      if (history.length > 100) history = history.slice(-100);
      history.push(filePath);
      ctx.globalState.update(HISTORY_KEY, history);
    }
  });
  const regCmd = vscode.commands.registerCommand;
  ctx.subscriptions.push(regCmd('extension.xi.goBack', () => {
    const history = ctx.globalState.get(HISTORY_KEY);
    if (Array.isArray(history) && history.length > 1) {
      //  Current file.
      history.pop();
      //  Previous file
      const filePath = history.pop();
      ctx.globalState.update(HISTORY_KEY, history);
      const uri = vscode.Uri.file(filePath);
      vscode.workspace.openTextDocument(uri).then(doc => {
        vscode.window.showTextDocument(doc);
      });
    }
  }));
}
