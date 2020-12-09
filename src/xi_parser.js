function parse(text, cancel) {
  return [];
}


class Token {
  // Indentation followed by dot and space: marks paragraph begin.
  static BEGIN_MARK = 2;
  // Space followed by dot and EOL: marks heading end.
  static END_MARK = 3;
}


//  Parse text into tokens which has position within text. Tokens before
//  and after of the current one are analyzed in order to get meaning
//  from the grammar. Tokens should be organized a way so no knowledge of
//  previous or next token is required to determine current token.
function tokenize(text, cancel) {
}


module.exports = {
  parse,
};
