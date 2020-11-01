module.exports = function(vscode) {


  class FoldProvider {


    provideFoldingRanges(doc, context, token) {
      return [];
    }
  }


  return FoldProvider;
}
