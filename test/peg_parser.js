const fs = require('fs/promises');
const chai = require('chai');
const expect = chai.expect;
const peg = require("pegjs");


describe("PEG.js Xi grammar parsing", () => {

  let _grammar = null;
  let _parser = null;


  before("load grammar", async () => {
    _grammar = await fs.readFile('./src/xi.pegjs', 'utf-8');
    _parser = peg.generate(_grammar);
  });


  it("has grammar", async () => {
    expect(_grammar).exist;
  });


  it("has parser from grammar", async () => {
    expect(_parser).exist;
  })


  it("matches header", async () => {
    _parser.parse("foo .");
  })


  it("matches paragraph", async () => {
    _parser.parse("  . foo");
  })
});
