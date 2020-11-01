const chai = require('chai');
const expect = chai.expect;
const getFoldProvider = require('./../src/get_fold_provider.js');


describe("FoldProvider class", () => {

  const vscode = {
  };


  it("can be instantiated", () => {
    const FoldProvider = getFoldProvider(vscode);
    const inst = new FoldProvider();
    expect(inst).to.be.ok;
  });
});
