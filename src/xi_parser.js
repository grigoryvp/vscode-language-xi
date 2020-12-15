function parse(text, cancel) {
  return [];
}


class Token {
  // Indentation followed by dot and space: marks paragraph begin.
  static BEGIN_MARK = 2;
  // Space followed by dot and EOL: marks heading end.
  static END_MARK = 3;
  // Anything else.
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
  const STR_BEGIN_MARK = 4;
  const TEXT = 5;
  let mode = STR_BEGIN;
  let pos = -1;
  let acc = "";
  let tokens = [];

  while(!cancel.isCancellationRequested) {
    pos += 1;
    if (pos >= text.length) {
      if (acc.length) {
          token = new Token();
          token.text = acc;
          token.pos = pos - acc.length;
          token.type = Token.TEXT;
          tokens.push(token);
      }
      break;
    }
    const char = text[pos];
    switch(char) {
      case " ":
        acc += char
        switch(mode) {
          case STR_BEGIN:
            //  If string starts with spaces it can be a paragraph indent.
            mode = STR_INDENT;
            break;
          case STR_BEGIN_MARK:
            token = new Token();
            token.text = acc;
            token.pos = pos - acc.length;
            token.type = Token.BEGIN_MARK;
            tokens.push(token);
            acc = "";
            mode = TEXT;
            break;
          default:
            mode = TEXT;
            break;
        }
      case ".":
        acc += char
        switch(mode) {
          case STR_INDENT:
            if (acc.length % 2 == 0) {
              // 2 * space followed by dot and space is paragraph begin mark.
              mode = STR_BEGIN_MARK;
            }
            else {
              mode = TEXT;
            }
            break;
          default:
            mode = TEXT;
            break;
        }
      case "\r":
      case "\n":
        if (acc.length) {
            token = new Token();
            token.text = acc;
            token.pos = pos - acc.length;
            token.type = Token.TEXT;
            tokens.push(token);
        }
        mode = STR_BEGIN;
        acc = "";
        break;
      default:
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
