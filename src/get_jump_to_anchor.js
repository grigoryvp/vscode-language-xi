module.exports = function(vscode) {

  // From MDN
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }


  return function(anchor) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    const doc = editor.document;
    const text = doc.getText();

    const query = (() => {
      const needle = escapeRegExp(anchor);
      if (anchor.endsWith('#')) {
        const query = `\[${needle}\]`;
        return new RegExp(query, 'im');
      }
      //! Can't use '\s' since it matches '\n' in multiline mode.
      const link = `(\\[[^\\]]*\\])?`;
      const selflink = `(\\[\\])?`;
      const type = `([^ \\t][ \\t])?`;
      const begin = `[ \\t]*${type}${link}[ \\t]*`;
      const end = `${selflink}[ \\t]*${link}[ \\t]\\.`;
      const query = `^${begin}${needle}${end}$`;
      //  No 'g', first match.
      return new RegExp(query, 'im');
    })();

    const idx = text.search(query);
    if (idx === -1) return;
    const pos = doc.positionAt(idx);
    const range = new vscode.Range(pos, pos);
    editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
    const selection = new vscode.Selection(pos, pos);
    editor.selection = selection;
  }
}
