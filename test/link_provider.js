const chai = require('chai');
const expect = chai.expect;
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
    getText: () => '',
    fileName: 'foo.xi',
    positionAt: (v) => v,
  };

  const cancel = {};


  it("can be instantiated", () => {
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    chai.assert(inst);
  });


  it("matches simple link", () => {
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    doc.getText = () => "[a]";
    const ret = inst.provideDocumentLinks(doc, cancel);
    expect(ret).to.have.lengthOf(1);
    const link = ret[0];
    expect(link).deep.includes({range: {begin: 1, end: 2}});
  });


  it("not matches inside code sample", () => {
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    doc.getText = () => "  | foo [a]";
    const ret = inst.provideDocumentLinks(doc, cancel);
    expect(ret).to.have.lengthOf(0);
  });
});
