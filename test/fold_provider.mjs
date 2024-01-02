import * as chai from 'chai';
const expect = chai.expect;
import getFoldProvider from './../src/get_fold_provider.mjs';


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
