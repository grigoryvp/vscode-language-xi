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
      while (true) {
        if (cancel.isCancellationRequested) return [];
        const match = query.exec(text);
        if (!match) break;

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
        if (prefix.match(/^\s*\|\s+/)) continue;

        let pipeCount = 0;
        for (const char of prefix) if (char === '|') pipeCount ++;
        //  Do not match likes inside marked words: `|foo| |bar| |[baz]|`.
        if (pipeCount % 2) continue;

        const [link, anchor] = name.split('#');
        const fileName = `${link.replace(/ /g, '_')}.xi`;
        const dir = path.dirname(doc.fileName);
        const file = path.join(dir, fileName);
        const [begin, end] = [beginIdx, endIdx].map(v => doc.positionAt(v));
        const range = new vscode.Range(begin, end);
        let uri = null;
        if (anchor) {
          uri = vscode.Uri.parse(`command:extension.xi.open?${
            encodeURIComponent(JSON.stringify({
              file,
              anchor
            }))
          }`);
        }
        else {
          //  If no anchor like [foo#bar] is specified, use normal file
          //  uri so VSCode will ask to create a file if it does not exists.
          uri = vscode.Uri.file(file);
        }
        res.push(new vscode.DocumentLink(range, uri));
      }
      return res;
    }


    //  Gather links for header wikiwords like "  [foo] bar baz[] [foo] ."
    _getHeaderLinks(doc, cancel) {
      const res = [];
      const text = doc.getText();
      const query = (() => {
        const link = `\\[[^\\]]+\\]`;
        //  Header can't end with space, ex 'foo [] .': '[]' or ' .' should
        //  be adjasted to it.
        const header = `[^\\[\\r\\n]*[^ \\[\\r\\n]`;
        const terminator = `\\s\\.`;
        const begin = `\\s*(?:${link}\\s+)?`;
        const end = `\\[\\](?:\\s+${link})?${terminator}`;
        const query = `^(${begin})(${header})(${end})$`;
        return new RegExp(query, 'gm');
      })();
      while (true) {
        var match = query.exec(text);
        if (!match) break;
        if (cancel.isCancellationRequested) return [];
        //  We have exactly 3 capture groups
        if (match.length !== 4) continue;
        //  match[1] is 'begin' query part
        let beginIdx = match.index + match[1].length;
        //  match[3] is 'end' query part
        let endIdx = match.index + match[0].length - match[3].length;
        const [begin, end] = [beginIdx, endIdx].map(v => doc.positionAt(v));
        const name = text.substr(beginIdx, endIdx - beginIdx);
        const fileName = `${name.replace(/ /g, '_')}.xi`.toLowerCase();
        const dir = path.dirname(doc.fileName);
        const range = new vscode.Range(begin, end);
        const uri = vscode.Uri.file(path.join(dir, fileName));
        res.push(new vscode.DocumentLink(range, uri));
      }
      return res;
    }
  }

  return LinkProvider;
}
