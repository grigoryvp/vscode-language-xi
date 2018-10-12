module.exports = function(vscode) {

  // From MDN
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }


  function jumpToPos(editor, idx) {
    const pos = editor.document.positionAt(idx);
    const range = new vscode.Range(pos, pos);
    editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
    const selection = new vscode.Selection(pos, pos);
    editor.selection = selection;
  }


  return function(anchor) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    let text = editor.document.getText();

    //  Special case, link to same document like [#foo]
    if (anchor.startsWith('#')) {
      const idx = text.search(`[${anchor}#]`);
      if (!idx) return;
      jumpToPos(editor, idx);
      return;
    }

    let lastFoundIdx = null;
    //  Handle nested anchor like [foo#bar#baz]
    for (const fragment of anchor.split('#')) {
      const query = (() => {
        const needle = escapeRegExp(fragment);
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

      const match = text.match(query);
      //  Break on first not found and use last found index, if any.
      if (!match) return;
      if (!lastFoundIdx) {
        lastFoundIdx = match.index;
      }
      else {
        //  We are searching reminaing text, so it's a relative index.
        lastFoundIdx += match.index;
      }

      //  Remaining text.
      text = text.slice(lastFoundIdx);
    }

    if (lastFoundIdx) {
      jumpToPos(editor, lastFoundIdx);
    }
  }
}
