const vscode = require('vscode');
const path = require('path');

module.exports.activate = function(ctx) {
  ctx.subscriptions.push(vscode.languages.registerDocumentLinkProvider(
    'xi', new LinkProvider()));
}


class LinkProvider {
  provideDocumentLinks(doc, cancel) {
    const res = [];
    const text = doc.getText();
    const query = /\[[^ \]\r\n]\]|\[[^ \]\r\n][^\]\r\n]*[^ \]\r\n]\]/gm;
    var match = query.exec(text);
    while (match) {
      //  Skip '[' and ']', min length is 3 for wikiwords like '[v]'.
      const beginIdx = match.index + 1;
      const endIdx = match.index + match[0].length - 1;
      const [begin, end] = [beginIdx, endIdx].map(v => doc.positionAt(v));
      const name = text.substr(beginIdx, endIdx - beginIdx);
      const fileName = `${name.replace(/ /g, '_')}.xi`;
      const dir = path.dirname(doc.fileName);
      res.push(new vscode.DocumentLink(
				new vscode.Range(begin, end),
        vscode.Uri.file(path.join(dir, fileName))));
      match = query.exec(text);
    }
    return res;
  }
}
