import * as chai from 'chai';
const expect = chai.expect;
import getCmd from './../src/get_go_back_cmd.mjs';


describe("'go back' command", () => {
  const state = {key: ['foo.xi', 'bar.xi']};
  const vscode = {
    Uri: {
      file: (path) => ({path}),
      parse: (text) => ({text}),
    },
    workspace: {
      openTextDocument: (uri) => new Promise((resolve) => resolve({uri})),
    },
    window: {
      showTextDocument: (doc) => {},
    },
  };
  const ctx = {
    globalState: {
      get: (key) => state[key],
      update: (key, val) => state[key] = val,
    },
    document: {
      fileName: 'foo.xi'
    }
  };


  it("gets document from history", () => {
    const cmd = getCmd(vscode, ctx, 'key');
    vscode.window.showTextDocument = (doc) => {
      expect(doc).deep.includes({uri: {path: 'foo.xi'}});
    };
    cmd(ctx);
  });
});
