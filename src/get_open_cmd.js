module.exports = function(vscode) {
  // From MDN
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }


  return function(argmap) {
    if (!argmap) return;

    function jumpToAnchor(query) {
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

    const {file, anchor} = argmap;
    //  Link like [#foo] to [#foo] anchor in same file.
    if (!file && anchor) {
      // jump to anchor like [foo#]
      jumpToAnchor(`[${anchor}#]`);
    }
    //  Link like [foo] or [foo#bar].
    else {
      const uri = vscode.Uri.file(file);
      vscode.workspace.openTextDocument(uri).then(doc => {
        vscode.window.showTextDocument(doc).then(editor => {
          if (!anchor) return;
          const query = (() => {
            const link = `(\\[[^\\]]*\\])?`;
            const selflink = `(\\[\\])?`;
            const type = `([^\\s]\\s)?`;
            const needle = escapeRegExp(anchor);
            const begin = `\\s*${type}${link}\\s*`;
            const end = `${selflink}\\s*${link}\\s\\.`;
            const query = `^${begin}${needle}${end}$`;
            //  No 'g', first match.
            return new RegExp(query, 'im');
          })();
          // Search headings like `  * [link] some header[] [another link] .`
          jumpToAnchor(query);
        });
      });
    }
  }
}
