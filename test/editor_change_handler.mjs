import * as chai from 'chai';
const expect = chai.expect;
import getHandler from './../src/get_editor_change_handler.mjs';


describe("'active editor changed' handler", () => {
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
