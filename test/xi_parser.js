const fs = require('fs/promises');
const chai = require('chai');
const expect = chai.expect;

const parser = require('./../src/xi_parser.js');


describe("Xi grammar parsing", () => {

  let _sample = null;


  before("load sample", async () => {
    _sample = await fs.readFile('./test/test.xi', 'utf-8');
  });


  it("starts parsing", async () => {
    parser.parse(_sample).exist;
  });
});
