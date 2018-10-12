const chai = require('chai');
const expect = chai.expect;
const getHandler = require('./../src/get_editor_change_handler.js');


describe("LinkProvider class", () => {
  const state = {};
  const ctx = {
    globalState: {
      get: (key) => state[key],
      update: (key, val) => state[key] = val,
    },
    document: {
      fileName: 'foo.xi'
    }
  };


  it("adds document to history", () => {
    const handler = getHandler(ctx, 'key');
    handler(ctx);
    expect(state).deep.includes({key: ['foo.xi']});
  });
});
