const getJumpToAnchor = require('./get_jump_to_anchor.js');


module.exports = function(vscode) {
  const jumpToAnchor = getJumpToAnchor(vscode);


  return function(argmap) {
    if (!argmap) return;

    const {file, anchor} = argmap;
    //  Link like [#foo] to [#foo] anchor in same file.
    if (!file && anchor) {
      // jump to anchor like [foo#]
      jumpToAnchor(`${anchor}#`);
    }
    //  Link like [foo] or [foo#bar].
    else {
      const uri = vscode.Uri.file(file);
      vscode.workspace.openTextDocument(uri).then(doc => {
        vscode.window.showTextDocument(doc).then(() => {
          if (!anchor) return;
          // Search headings like `  * [link] some header[] [another link] .`
          jumpToAnchor(anchor);
        });
      });
    }
  }
}
