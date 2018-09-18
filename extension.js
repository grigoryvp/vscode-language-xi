const vscode = require('vscode');
const geLinkProvider = require('./get_link_provider.js');


const HISTORY_KEY = 'file-history';


// From MDN
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


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

  ctx.subscriptions.push(regCmd('extension.xi.open', (argmap) => {
    if (!argmap) return;
    const {file, anchor} = argmap;
    if (!file) return;
    const uri = vscode.Uri.file(file);
    vscode.workspace.openTextDocument(uri).then(doc => {
      vscode.window.showTextDocument(doc).then(editor => {
        if (!anchor) return;
        const text = doc.getText().toLowerCase()
        const link = `(\\[[^\\]]*\\])?`;
        const selflink = `(\\[\\])?`;
        const type = `([^\\s]\\s)?`;
        const needle = escapeRegExp(anchor);
        // Search headings like `  * [link] some header[] [another link] .`
        const idx = text.search(new RegExp(`
          ^\\s*${type}${link}\\s*${needle}${selflink}\\s*${link}\\s\\.$
        `.trim(), 'im'));
        if (idx === -1) return;
        const pos = doc.positionAt(idx);
        const range = new vscode.Range(pos, pos);
        editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
        const selection = new vscode.Selection(pos, pos);
        editor.selection = selection;
      });
    });
  }));
}
