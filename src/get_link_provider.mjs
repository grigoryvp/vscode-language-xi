import * as tools from './tools.mjs';


// Requires vscode.Uri.Utils to reference { Utils } from 'vscode-uri'
export default function getLinkProvider(vscode) {
  const Utils = vscode.Uri.Utils;


  class LinkProvider {


    async provideDocumentLinks(doc, cancel) {
      const cfg = vscode.workspace.getConfiguration('xi');
      if (cfg.debug) {
        tools.debug(vscode, "LinkProvider().provideDocumentLinks()");
        const dirUri = Utils.dirname(vscode.Uri.file(doc.fileName));
        tools.debug(vscode, `  doc ${doc.fileName} dir ${dirUri.toString()}`);
      }

      const res = [];
      res.push(... await this._getWikiwordLinks(doc, cancel));
      if (cancel.isCancellationRequested) return [];
      res.push(... await this._getHeaderLinks(doc, cancel));
      if (cancel.isCancellationRequested) return [];
      return res;
    }


    //  Give link name inside [], like "foo#bar" evaluates to vscode.Uri
    //  or null.
    async _linkNameToVSCodeURI(doc, name) {
      if (name.startsWith('#')) {
        const anchor = name.slice(1).trim();
        if (anchor.length) {
          return vscode.Uri.parse(`command:extension.xi.open?${
            encodeURIComponent(JSON.stringify({
              //  Without file it's not header anchor, but a wikiword.
              anchor,
            }))
          }`);
        }
        else {
          //  [#] or #[] is meaningless
          return null;
        }
      }
      else if (name.match(/^[a-zA-Z_-]+:\/\//)) {
        return vscode.Uri.parse(name);
      }
      else {
        const [link, ...anchorSeq] = name.split('#');
        const anchor = anchorSeq.join('#');
        //  Always use lowercase since different wikiwords can have
        //  different writing depending on context, ex capitalized at
        //  the sentence start.
        const fileName = `${link.replace(/ /g, '_')}.xi`.toLowerCase();
        const dirUri = Utils.dirname(vscode.Uri.file(doc.fileName));
        let fileUri = null;
        if (dirUri.path && dirUri.path.length > 0) {
          fileUri = Utils.joinPath(dirUri, fileName);
        } else {
          fileUri = vscode.Uri.file(fileName);
        }

        if (anchor) {
          return vscode.Uri.parse(`command:extension.xi.open?${
            encodeURIComponent(JSON.stringify({file: fileUri.path, anchor}))
          }`);
        }
        else {
          try {
            await vscode.workspace.fs.stat(fileUri);
            // Open existing file reusing current editor tab if possible
            return vscode.Uri.parse(`command:extension.xi.open?${
              encodeURIComponent(JSON.stringify({file: fileUri.path}))
            }`);
          } catch(e) {
            //  If no anchor like [foo#bar] or foo#bar[] is specified, use
            //  normal file //  uri so VSCode will ask to create a file if
            //  it does not exists. This will use a new editor tab.
            return fileUri;
          }
        }
      }
    }


    //  Gather links for simple wikiwords like "[foo#bar]"
    async _getWikiwordLinks(doc, cancel) {
      const res = [];
      const text = doc.getText();
      const textLen = text.length
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
        let lineEndIdx = match.index;
        while (lineEndIdx < textLen && text[lineEndIdx + 1] !== "\n") {
          lineEndIdx += 1;
        }
        const name = text.substr(beginIdx, endIdx - beginIdx);
        //  String from line start to link match.
        const prefix = text.substr(lineBeginIdx, match.index - lineBeginIdx);
        //  Line containing the link
        const line = text.substr(lineBeginIdx, lineEndIdx - lineBeginIdx + 1);

        //  Do not match links in code smaples like `  | [foo]`
        if (prefix.match(/^\s*\|\s+/)) continue;
        //  Do not match links in code smaples like `. | [foo]`
        if (prefix.match(/^\s*\. \|\s+/)) continue;
        //  Do not match links that contain '|', most probably it's
        //  something like "|[| |]]|"
        if (name.includes('|')) continue;

        const charBefore = beginIdx > 1 ? text[beginIdx - 2] : null;
        const charAfter = endIdx < text.length - 1 ? text[endIdx + 1] : null;
        //  Can be something like |[foo]| or |{lng:py} foo[bar]|
        if (line.includes('|')) {
          let markBeginIdx = null;
          let found = false;
          //  Go from left to right and find all marked words and code
          //  samples. They are started with pipe plus adjasted character
          //  to the right and ended with pipe plus adjasted character
          //  to the left, with any characters inbetween.
          for (let i = lineBeginIdx + 1; i <= lineEndIdx - 1; i ++) {
            const curChar = text[i];
            const prevChar = text[i - 1];
            const nextChar = text[i + 1];
            if (curChar != ' ' && prevChar == '|') {
              markBeginIdx = i;
              continue;
            }
            if (curChar != ' ' && nextChar == '|' && markBeginIdx) {
              const markEndIdx = i;
              // Link within a marked word or a code sample?
              if (beginIdx >= markBeginIdx && endIdx <= markEndIdx) {
                found = true;
                break;
              }
              markBeginIdx = null;
            }
          }
          //  Do not match links inside marked words: `|foo| |bar| |[baz]|`
          //  and inside code samples with meta info: `|{lng:js}[foo]|`
          if (found) continue;
        }

        //! Can't rely on pipe count: `||| [foo]`.
        // if (charBefore === '|' && charAfter === '|') continue;

        const uri = await this._linkNameToVSCodeURI(doc, name);
        if (uri) {
          const toPosition = (v) => doc.positionAt(v);
          const [begin, end] = [beginIdx, endIdx].map(toPosition);
          const range = new vscode.Range(begin, end);
          res.push(new vscode.DocumentLink(range, uri));
        }
      }
      return res;
    }


    //  Gather links for header wikiwords like "  [foo] bar baz[] [foo] ."
    //  This also includes header anchor links like #todo[]
    async _getHeaderLinks(doc, cancel) {
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
        const name = text.substr(beginIdx, endIdx - beginIdx);

        const uri = await this._linkNameToVSCodeURI(doc, name)
        if (uri) {
          const toPosition = (v) => doc.positionAt(v);
          const [begin, end] = [beginIdx, endIdx].map(toPosition);
          const range = new vscode.Range(begin, end);
          res.push(new vscode.DocumentLink(range, uri));
        }
      }
      return res;
    }
  }

  return LinkProvider;
}
