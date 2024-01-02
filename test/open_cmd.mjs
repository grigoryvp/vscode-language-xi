import * as chai from 'chai';
const expect = chai.expect;
import getCmd from './../src/get_open_cmd.mjs';


describe("'open' command", () => {
  const vscode = {
    Uri: {
      file: (path) => ({path}),
    },
    workspace: {
      openTextDocument: (uri) => new Promise((resolve) => resolve({uri})),
    },
    window: {
      showTextDocument: (doc) => new Promise((resolve) => resolve()),
    },
  };


  it("opens a link", () => {
    const cmd = getCmd(vscode);
    vscode.window.showTextDocument = (doc) => {
      expect(doc).deep.includes({uri: {path: 'foo.xi'}});
      return new Promise((resolve) => resolve());
    }
    cmd({file: 'foo.xi'});
  });
});
