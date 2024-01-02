module.exports = function(vscode) {


  class FoldProvider {


    provideFoldingRanges(doc, context, token) {
      // return [vscode.FoldingRange(0, 10, vscode.FoldingRangeKind.Region)];
      return [];
    }
  }


  return FoldProvider;
}
