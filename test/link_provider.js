const chai = require('chai');
const getLinkProvider = require('./../get_link_provider.js');


describe("LinkProvider class", () => {


  it("can be instantiated", () => {
    const vscode = {};
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    chai.assert(inst);
  });

  it("runs", () => {
    const vscode = {
      Range: function() {},
      DocumentLink: function() {},
      Uri: {
        file: () => ({}),
      },
    };
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    const doc = {
      getText: () => '  | [a]',
      fileName: 'foo.xi',
      positionAt: () => 0,
    };
    const cancel = {};
    const ret = inst.provideDocumentLinks(doc, cancel);
  });
});
