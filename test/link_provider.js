const chai = require('chai');
const getLinkProvider = require('./../get_link_provider.js');


describe("LinkProvider class", () => {

  const vscode = {
    Range: function(...v) { [this.begin, this.end] = [...v]; },
    DocumentLink: function(...v) { [this.range, this.uri] = [...v]; },
    Uri: {
      file: (path) => ({path}),
    },
  };

  const doc = {
    getText: () => '  | [a]',
    fileName: 'foo.xi',
    positionAt: (v) => v,
  };

  const cancel = {};


  it("can be instantiated", () => {
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    chai.assert(inst);
  });


  it("runs", () => {
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    const ret = inst.provideDocumentLinks(doc, cancel);
  });
});
