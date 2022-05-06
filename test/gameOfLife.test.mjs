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

  it("The game produces a board of height 30", () =>{
    const result = gameOfLife();
    expect(result.startBoard.length).to.equal(30);
  })

  it("The board consists of arrays of length 30", () =>{
    const result = gameOfLife();
    const lengths = [];
    result.startBoard.forEach(array => lengths.push(array.length))
    expect(lengths.filter(length => length === 30).length).to.equal(result.startBoard.length);
  })

  it("The board is full of dead cells before entering the pattern", () =>{
    const result = gameOfLife();
    let checker = true;
    for (let i = 0; i < result.startBoard.length; i++){
      for (let j = 0; j < result.startBoard.length; j++){
        if (result.startBoard[i][j] != 'o') checker = false;
      }
    }
    expect(checker).to.equal(true);
  })



});
