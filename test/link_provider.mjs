const chai = require('chai');
const expect = chai.expect;
const getLinkProvider = require('./../src/get_link_provider.js');


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
    expect(inst).to.be.ok;
  });


  it("matches simple link", () => {
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    doc.getText = () => "[a]";
    const ret = inst.provideDocumentLinks(doc, cancel);
    expect(ret).to.have.lengthOf(1);
    const link = ret[0];
    expect(link).deep.includes({range: {begin: 1, end: 2}});
    expect(link).deep.includes({uri: {path: "a.xi"}});
  });


  it("lowercase file names for links", () => {
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    doc.getText = () => "[Ab]";
    const ret = inst.provideDocumentLinks(doc, cancel);
    expect(ret).to.have.lengthOf(1);
    const link = ret[0];
    expect(link).deep.includes({range: {begin: 1, end: 3}});
    expect(link).deep.includes({uri: {path: "ab.xi"}});
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


  it("matches header link to anchor", () => {
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    doc.getText = () => "#foo[] .";
    const ret = inst.provideDocumentLinks(doc, cancel);
    expect(ret).to.have.lengthOf(1);
    const link = ret[0];
    expect(link).deep.includes({range: {begin: 0, end: 4}});
    const prefix = 'command:extension.xi.open?';
    const text = prefix + encodeURIComponent(JSON.stringify({
      anchor: "foo",
    }));
    expect(link).deep.includes({uri: {text}});
  });


  it("matches header link to url", () => {
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    doc.getText = () => "http://foo[] .";
    const ret = inst.provideDocumentLinks(doc, cancel);
    expect(ret).to.have.lengthOf(1);
    const link = ret[0];
    expect(link).deep.includes({range: {begin: 0, end: 10}});
    expect(link).deep.includes({uri: {text: 'http://foo'}});
  });


  it("not matches inside single line code sample", () => {
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    doc.getText = () => "|{lng}[a]|";
    const ret = inst.provideDocumentLinks(doc, cancel);
    expect(ret).to.have.lengthOf(0);
  });


  it("not matches inside multiline code sample", () => {
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    doc.getText = () => "  | foo [a]";
    const ret = inst.provideDocumentLinks(doc, cancel);
    expect(ret).to.have.lengthOf(0);
  });


  it("not matches inside paragraph code sample", () => {
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    doc.getText = () => ". | foo [a]";
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
    const prefix = 'command:extension.xi.open?';
    const text = prefix + encodeURIComponent(JSON.stringify({
      file: "a.xi",
      anchor: "b",
    }));
    expect(link).deep.includes({uri: {text}});
  });


  it("matches link with nested anchor", () => {
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    doc.getText = () => "[a#b#c]";
    const ret = inst.provideDocumentLinks(doc, cancel);
    expect(ret).to.have.lengthOf(1);
    const link = ret[0];
    expect(link).deep.includes({range: {begin: 1, end: 6}});
    const prefix = 'command:extension.xi.open?';
    const text = prefix + encodeURIComponent(JSON.stringify({
      file: "a.xi",
      anchor: "b#c",
    }));
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
    const prefix = 'command:extension.xi.open?';
    const text = prefix + encodeURIComponent(JSON.stringify({
      anchor: "b"
    }));
    expect(link).deep.includes({uri: {text}});
  });


  it("matches http link", () => {
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    doc.getText = () => "[http://foo]";
    const ret = inst.provideDocumentLinks(doc, cancel);
    expect(ret).to.have.lengthOf(1);
    const link = ret[0];
    expect(link).deep.includes({range: {begin: 1, end: 11}});
    expect(link).deep.includes({uri: {text: 'http://foo'}});
  });

  it("matches link anchors with slashes", () => {
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    doc.getText = () => "[a#b/#c/]";
    const ret = inst.provideDocumentLinks(doc, cancel);
    expect(ret).to.have.lengthOf(1);
    const link = ret[0];
    expect(link).deep.includes({range: {begin: 1, end: 8}});
    const prefix = 'command:extension.xi.open?';
    const text = prefix + encodeURIComponent(JSON.stringify({
      file: "a.xi",
      anchor: "b/#c/",
    }));
    expect(link).deep.includes({uri: {text}});
  });

  it("not matches between marked text", () => {
    const LinkProvider = getLinkProvider(vscode);
    const inst = new LinkProvider();
    doc.getText = () => "|[| |]]|";
    const ret = inst.provideDocumentLinks(doc, cancel);
    expect(ret).to.have.lengthOf(0);
  });
});
