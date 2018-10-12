const getJumpToAnchor = require('./get_jump_to_anchor.js');


module.exports = function(vscode) {
  const jumpToAnchor = getJumpToAnchor(vscode);


  // From MDN
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }


  return function(argmap) {
    if (!argmap) return;

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
        vscode.window.showTextDocument(doc).then(() => {
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
