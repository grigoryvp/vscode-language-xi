const chai = require('chai');
const expect = chai.expect;
const getLinkProvider = require('./../get_link_provider.js');


describe("LinkProvider class", () => {

  const vscode = {
    Range: function(...v) { [this.begin, this.end] = [...v]; },
    DocumentLink: function(...v) { [this.range, this.uri] = [...v]; },
    Uri: {
      file: (path) => ({path}),
      parse: (text) => ({text}),
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


  it("matches simple header link", () => {
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    doc.getText = () => "foo[] .";
    const ret = inst.provideDocumentLinks(doc, cancel);
    expect(ret).to.have.lengthOf(1);
    const link = ret[0];
    expect(link).deep.includes({range: {begin: 0, end: 3}});
  });


  it("matches simple header link with offset", () => {
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    doc.getText = () => "  foo[] .";
    const ret = inst.provideDocumentLinks(doc, cancel);
    expect(ret).to.have.lengthOf(1);
    const link = ret[0];
    expect(link).deep.includes({range: {begin: 2, end: 5}});
  });


  it("matches header link for wikiword at start", () => {
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    doc.getText = () => "[foo] bar[] .";
    const ret = inst.provideDocumentLinks(doc, cancel);
    expect(ret).to.have.lengthOf(2);
    const link = ret[1];
    expect(link).deep.includes({range: {begin: 6, end: 9}});
  });


  it("matches header link for wikiword at end", () => {
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    doc.getText = () => "foo[] [bar] .";
    const ret = inst.provideDocumentLinks(doc, cancel);
    expect(ret).to.have.lengthOf(2);
    const link = ret[1];
    expect(link).deep.includes({range: {begin: 0, end: 3}});
  });


  it("not matches inside code sample", () => {
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    doc.getText = () => "  | foo [a]";
    const ret = inst.provideDocumentLinks(doc, cancel);
    expect(ret).to.have.lengthOf(0);
  });


  it("not matches inside marked text", () => {
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    doc.getText = () => "|foo| |bar| |[baz]|";
    let ret = inst.provideDocumentLinks(doc, cancel);
    expect(ret).to.have.lengthOf(0);

    //  Wrong number of pipes before link.
    doc.getText = () => "||a| [b]";
    ret = inst.provideDocumentLinks(doc, cancel);
    expect(ret).to.have.lengthOf(1);
    const link = ret[0];
    expect(link).deep.includes({range: {begin: 6, end: 7}});
  });


  it("matches link with anchor", () => {
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    doc.getText = () => "[a#b]";
    const ret = inst.provideDocumentLinks(doc, cancel);
    expect(ret).to.have.lengthOf(1);
    const link = ret[0];
    expect(link).deep.includes({range: {begin: 1, end: 4}});
    const text = 'command:extension.xi.open?' +
      '%7B%22file%22%3A%22a.xi%22%2C%22anchor%22%3A%22b%22%7D';
    expect(link).deep.includes({uri: {text}});
  });


  it("matches link to anchor", () => {
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    doc.getText = () => "[#b]";
    const ret = inst.provideDocumentLinks(doc, cancel);
    expect(ret).to.have.lengthOf(1);
    const link = ret[0];
    expect(link).deep.includes({range: {begin: 1, end: 3}});
    const text = 'command:extension.xi.open?' +
      '%7B%22anchor%22%3A%22b%22%7D';
    expect(link).deep.includes({uri: {text}});
  });


  it("matches http link inside special", () => {
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    doc.getText = () => "|http://foo|";
    const ret = inst.provideDocumentLinks(doc, cancel);
    expect(ret).to.have.lengthOf(1);
    const link = ret[0];
    expect(link).deep.includes({range: {begin: 1, end: 11}});
    expect(link).deep.includes({uri: {text: 'http://foo'}});
  });
});
