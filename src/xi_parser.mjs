function parse(text, cancel) {
  return [];
}


class Token {
  //  Indentation followed by dot and space: marks paragraph begin.
  static BEGIN_MARK = 2;
  //  Space followed by dot and EOL: marks heading end.
  static END_MARK = 3;
  //  Anything else.
  static TEXT = 4;


  constructor() {
    this.type = null;
    this.pos = 0;
    this.indent = 0;
    this.text = "";
  }
}


//  Parse text into tokens which has position within text. Tokens before
//  and after of the current one are analyzed in order to get meaning
//  from the grammar. Tokens should be organized a way so no knowledge of
//  previous or next token is required to determine current token.
function tokenize(text, cancel) {
  const STR_BEGIN = 2;
  const STR_INDENT = 3;
  const BEGIN_MARK_WAIT_SPACE = 4;
  const END_MARK_WAIT_DOT = 5;
  const END_MARK_WAIT_EOL = 6;
  const TEXT = 7;
  const EOF = null;
  let mode = STR_BEGIN;
  let pos = -1;
  let acc = "";
  let tokens = [];

  while(pos < text.length && !cancel.isCancellationRequested) {
    pos += 1;
    if (pos < text.length) {
      char = text[pos];
    }
    else {
      char = EOF;
    }
    switch(char) {
      case " ":
        acc += char;
        switch(mode) {
          case STR_BEGIN:
          case STR_INDENT:
            //  If string starts with spaces it can be a paragraph indent
            mode = STR_INDENT;
            break;
          case BEGIN_MARK_WAIT_SPACE:
            token = new Token();
            token.text = acc;
            token.pos = pos - (acc.length - 1);
            token.type = Token.BEGIN_MARK;
            tokens.push(token);
            acc = "";
            mode = TEXT;
            break;
          case TEXT:
            mode = END_MARK_WAIT_DOT;
            break;
          default:
            mode = TEXT;
            break;
        }
        break;
      case ".":
        acc += char;
        switch(mode) {
          case STR_INDENT:
            indentLen = acc.length - 1;
            if (indentLen % 2 == 0) {
              mode = BEGIN_MARK_WAIT_SPACE;
            }
            else {
              mode = TEXT;
            }
            break;
          case END_MARK_WAIT_DOT:
            mode = END_MARK_WAIT_EOL;
            break;
          default:
            mode = TEXT;
            break;
        }
        break;
      case "\r":
      case "\n":
      case EOF:
        switch(mode) {
          case END_MARK_WAIT_EOL:
            console.assert(acc.length > 2);
            const endMarkLen = 2;
            token = new Token();
            token.text = acc.substr(0, acc.length - endMarkLen);
            const eolPosOffset = 1;
            token.pos = pos - eolPosOffset - (acc.length - 1);
            token.type = Token.TEXT;
            tokens.push(token);
            token = new Token();
            token.text = " .";
            token.pos = pos - eolPosOffset - 1;
            token.type = Token.END_MARK;
            tokens.push(token);
            acc = "";
            mode = TEXT;
            break;
          default:
            if (acc.length) {
                token = new Token();
                token.text = acc;
                const eolPosOffset = 1;
                token.pos = pos - eolPosOffset - (acc.length - 1);
                token.type = Token.TEXT;
                tokens.push(token);
            }
            mode = STR_BEGIN;
            acc = "";
            break;
        }
      default:
        mode = TEXT;
        acc += char;
        break;
    }
  }

  return tokens;
}


module.exports = {
  parse,
  tokenize,
  Token,
};
