const path = require('path');


module.exports = function(vscode) {


  class LinkProvider {


    provideDocumentLinks(doc, cancel) {
      const res = [];
      res.push(...this._getWikiwordLinks(doc, cancel));
      if (cancel.isCancellationRequested) return [];
      res.push(...this._getHeaderLinks(doc, cancel));
      if (cancel.isCancellationRequested) return [];
      return res;
    }


    //  Gather links for simple wikiwords like "[foo#bar]"
    _getWikiwordLinks(doc, cancel) {
      const res = [];
      const text = doc.getText();
      const query = /\[[^ \]\r\n]\]|\[[^ \]\r\n][^\]\r\n]*[^ \]\r\n]\]/gm;
      var match = query.exec(text);
      while (match) {
        if (cancel.isCancellationRequested) return [];
        //  Skip '[' and ']', min length is 3 for wikiwords like '[v]'.
        const beginIdx = match.index + 1;
        const endIdx = match.index + match[0].length - 1;
        let lineBeginIdx = match.index;
        while (lineBeginIdx > 0 && text[lineBeginIdx - 1] !== "\n") {
          lineBeginIdx --;
        }
        const name = text.substr(beginIdx, endIdx - beginIdx);
        const prefix = text.substr(lineBeginIdx, match.index - lineBeginIdx);
        //  Do not match links in code smaples like `  | [foo]`
        if (!prefix.match(/^\s*\|\s+/)) {
          const fileName = `${name.split('#')[0].replace(/ /g, '_')}.xi`;
          const dir = path.dirname(doc.fileName);
          const [begin, end] = [beginIdx, endIdx].map(v => doc.positionAt(v));
          const range = new vscode.Range(begin, end);
          const uri = vscode.Uri.file(path.join(dir, fileName));
          res.push(new vscode.DocumentLink(range, uri));
        }
        match = query.exec(text);
      }
      return res;
    }


    //  Gather links for header wikiwords like "foo bar[] ."
    _getHeaderLinks(doc, cancel) {
      const res = [];
      const text = doc.getText();
      const query = /^[^\[\r\n]+\[\]\s*\.[\r\n]/gm;
      var match = query.exec(text);
      while (match) {
        if (cancel.isCancellationRequested) return [];
        let beginIdx = match.index;
        let endIdx = match.index + match[0].length;
        // Skip indentation at line begin
        while(beginIdx < text.length - 1 && text[beginIdx] === ' ') beginIdx ++;
        // Skip '[] .' at end
        while(endIdx > 0 && text[endIdx] !== '[') endIdx --;
        const [begin, end] = [beginIdx, endIdx].map(v => doc.positionAt(v));
        const name = text.substr(beginIdx, endIdx - beginIdx);
        const fileName = `${name.replace(/ /g, '_')}.xi`.toLowerCase();
        const dir = path.dirname(doc.fileName);
        const range = new vscode.Range(begin, end);
        const uri = vscode.Uri.file(path.join(dir, fileName));
        res.push(new vscode.DocumentLink(range, uri));
        match = query.exec(text);
      }
      return res;
    }
  }

  return LinkProvider;
}
