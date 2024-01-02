export function getJumpToAnchor(vscode) {

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
    anchor = anchor.toLowerCase();
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    let text = editor.document.getText().toLowerCase();

    //  Special case, link to same document like [#foo]
    if (anchor.startsWith('#')) {
      const query = escapeRegExp(`[${anchor.slice(1)}#]`);
      const idx = text.search(query);
      if (!idx) return;
      jumpToPos(editor, idx);
      return;
    }

    let lastFoundIdx = null;
    let lastFoundSize = 0;
    //  Handle nested anchor like [foo#bar#baz]
    for (const fragment of anchor.split('#')) {
      const query = (() => {
        const needle = escapeRegExp(fragment);
        //! Can't use '\s' since it matches '\n' in multiline mode.
        const link = `(\\[[^\\]]*\\])?`;
        const selflink = `(\\[\\])?`;
        //  Type for headers that defines something that has a type:
        //  @ property .
        //  @(seq) typed-property .
        const type = `([^ \\t\\n]+[ \\t])?`;
        const begin = `[ \\t]*${type}${link}[ \\t]*`;
        const end = `${selflink}[ \\t]*${link}[ \\t]\\.`;
        const query = `^${begin}${needle}${end}$`;
        //  No 'g', first match.
        return new RegExp(query, 'im');
      })();

      const match = text.match(query);
      //  Break on first not found and use last found index, if any.
      if (!match) break;

      if (!lastFoundIdx) {
        lastFoundIdx = match.index;
      }
      else {
        //  We are searching remainaing text, so it's a relative index.
        lastFoundIdx += lastFoundSize + match.index;
      }

      //  Remaining text.
      lastFoundSize = match[0].length;
      text = text.slice(match.index + lastFoundSize);

    }

    if (lastFoundIdx) {
      jumpToPos(editor, lastFoundIdx);
    }
  }
}
