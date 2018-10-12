module.exports = function(vscode) {


  return function(query) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    const doc = editor.document;
    const text = doc.getText();
    const idx = (() => {
      if (typeof(query) === 'string') return text.indexOf(query);
      return text.search(query);
    })();
    if (idx === -1) return;
    const pos = doc.positionAt(idx);
    const range = new vscode.Range(pos, pos);
    editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
    const selection = new vscode.Selection(pos, pos);
    editor.selection = selection;
  }
}
