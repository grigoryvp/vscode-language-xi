const chai = require('chai');
const expect = chai.expect;
const getFoldProvider = require('./../src/get_fold_provider.js');


describe("FoldProvider class", () => {

  const vscode = {
    FoldingRange: (start, end, kind) => {start, end, kind},
    FoldingRangeKind: {
      Region: 3,
    },
  };


  it("can be instantiated", () => {
    const FoldProvider = getFoldProvider(vscode);
    const inst = new FoldProvider();
    expect(inst).to.be.ok;
  });
});
