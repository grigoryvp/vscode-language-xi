const chai = require('chai');
const getLinkProvider = require('./../get_link_provider.js');


describe("LinkProvider class", () => {


  it("Can be instantiated", () => {
    const vscode = {};
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    chai.assert(inst);
  });
});
