import { expect } from "chai";
import { gameOfLife } from "../src/gameOfLife.mjs";
import fs from 'fs';
import exp from "constants";

describe("Tests for game of life", () => {
  before(() => {
    if (fs.existsSync('result.rle')) fs.unlinkSync('result.rle');
  })

  it("Can read file name", () => {
    const result = gameOfLife();
    expect(result.file).to.equal('blinker.rle');
  });

  it("Will create a rle-file as a result", () => {
    gameOfLife();
    expect(fs.existsSync('result.rle')).to.equal(true);
  })

  it("Can read dimensions of pattern in file", () => {
    const result = gameOfLife();
    expect(result.dimensions).to.equal('x = 3, y = 1');
  })
  
  it("Can read the pattern line from the file", () =>{
    const result = gameOfLife();
    expect(result.pattern).to.equal('3o!');
  })

});
