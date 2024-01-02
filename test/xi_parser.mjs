import * as fs from 'fs/promises';
import * as chai from 'chai';
const expect = chai.expect;

import * as parser from './../src/xi_parser.mjs';


describe("Xi grammar parsing", () => {

  let _sample = null;
  const _cancel = {
    isCancellationRequested: false,
  };


  before("load sample", async () => {
    _sample = await fs.readFile('./test/test.xi', 'utf-8');
  });


  it("starts parsing", async () => {
    parser.parse(_sample).exist;
  });


  it("tokenisez input", async () => {
    parser.tokenize(_sample, _cancel).exist;
  });


  it("finds begin mark token", async () => {
    tokens = parser.tokenize("  . foo", _cancel);
    expect(tokens).length(2);
    expect(tokens[0]).contains({type: parser.Token.BEGIN_MARK, pos: 0});
    expect(tokens[1]).contains({type: parser.Token.TEXT, pos: 4});
  });


  it("finds end mark token", async () => {
    tokens = parser.tokenize("foo .", _cancel);
    expect(tokens).length(2);
    expect(tokens[0]).contains({type: parser.Token.TEXT, pos: 0});
    expect(tokens[1]).contains({type: parser.Token.END_MARK, pos: 3});
  });


  it("has indent info for end mark", async () => {
    // WIP
    return
    tokens = parser.tokenize("  foo .", _cancel);
    expect(tokens).length(3);
    expect(tokens[0]).contains({type: parser.Token.INDENT, pos: 0});
    expect(tokens[0]).contains({type: parser.Token.TEXT, pos: 2});
    expect(tokens[1]).contains({type: parser.Token.END_MARK, pos: 5});
  });


  it("has indent info for begin mark", async () => {
    // WIP
    return
    tokens = parser.tokenize("  . foo", _cancel);
    expect(tokens).length(3);
    expect(tokens[0]).contains({type: parser.Token.INDENT, pos: 0});
    expect(tokens[0]).contains({type: parser.Token.BEGIN_MARK, pos: 2});
    expect(tokens[0]).contains({type: parser.Token.TEXT, pos: 4});
  });
});
