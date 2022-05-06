import { expect } from "chai";
import { updateBoard, neighbours, rleEncoder, initializeBoard, gameOfLife } from "../src/gameOfLife.mjs";
import fs from "fs";


describe("Tests for game of life", () => {
  before(() => {
    if (fs.existsSync("result.rle")) fs.unlinkSync("result.rle");
  });

  it("Can read file name", () => {
    const result = gameOfLife(0, "blinker.rle");
    expect(result.file).to.equal("blinker.rle");
  });

  it("Will create a rle-file as a result", () => {
    gameOfLife(0, "blinker.rle");
    expect(fs.existsSync("result.rle")).to.equal(true);
  });

  it("Can read dimensions of pattern in file", () => {
    const result = gameOfLife(0, "blinker.rle");
    expect(result.dimensions).to.equal("x = 3, y = 1");
  });

  it("Can read the pattern line from the file", () => {
    const result = gameOfLife(0, "blinker.rle");
    expect(result.patternText).to.equal("3o!");
  });

  it("The game produces a board of height 30", () => {
    const result = initializeBoard(30);
    expect(result.length).to.equal(30);
  });

  it("The board consists of arrays of length 30", () => {
    const result = initializeBoard(30);
    const lengths = [];
    result.forEach((array) => lengths.push(array.length));
    expect(lengths.filter((length) => length === 30).length).to.equal(
      result.length
    );
  });

  it("The board is full of dead cells before entering the pattern", () => {
    const result = initializeBoard(30);
    let checker = true;
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < result.length; j++) {
        if (result[i][j] != "b") {checker = false;}
      }
    }
    expect(checker).to.equal(true);
  });

  it("The game can interpret the rle-information", () => {
    const result = gameOfLife(0, "blinker.rle")
    expect(result.pattern.length).to.equal(3);
    expect(result.pattern.filter(elem => elem === 'o').length).to.equal(3);
  })

  it("The pattern is drawn upon the board", () => {
    const result = gameOfLife(0, "blinker.rle");
    let checker = true;
    for (let i = 0; i < result.board.length; i++) {
      for (let j = 0; j < result.board.length; j++) {
        if (
          result.board[i][j] != "b" &&
          !(
            i === 14 &&
            [13, 14, 15].includes(j) &&
            result.board[i][j] == "o"
          )
        )
          checker = false;
        if (
          i === 14 &&
          [13, 14, 15].includes(j) &&
          result.board[i][j] != "o"
        ) checker = false;
      }
    }
    expect(checker).to.equal(true);
  });

  it("The result file contains rle-information describing the dimensions of the board", () =>{
    gameOfLife(0,"blinker.rle");
    let data = fs.readFileSync('result.rle').toString();
    data = data.split('\n')
    expect(data[0]).to.equal('x = 30, y = 30, rule = B3/S23');
  })

  it("The rleEncoder can create a description of the board", () => {
    const result = gameOfLife(0, "blinker.rle");
    const rle = rleEncoder(result.board);
    expect(rle).to.equal('30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$13b3o14b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b!')    
  })

  it("The result file contains rle-information describing the content of the board", () =>{
    const result = gameOfLife(0, "blinker.rle");
    let data = fs.readFileSync('result.rle').toString();
    data = data.split('\n');
    expect(data[1]).to.equal('30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$13b3o14b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b!');
  })

  it("The game can use the iteration parameter", () =>{
    const result = gameOfLife(2, "blinker.rle")
    expect(result.iterations).to.equal(2);
  })


  it("The function neighbours checks amount of neighbours", ()=>{
    const result = neighbours([['b', 'b', 'o'],['b', 'o', 'b'], ['b', 'o', 'b']], 1, 1);
    expect(result).to.equal(2);
  })

  it("The function neighbours can identify amount of neighbour on game-board", ()=>{
    const game = gameOfLife(0, "blinker.rle");
    const result = neighbours(game.board, 14, 14);
    expect(result).to.equal(2);
  })

  it("The function updateBoard updates the board according to the rules of Conway", ()=>{
    const board = updateBoard([['b', 'b', 'o'],['b', 'o', 'b'], ['b', 'o', 'b']])
    expect(board[0].toString()).to.equal('b,b,b');
    expect(board[1].toString()).to.equal('b,o,o');
    expect(board[2].toString()).to.equal('b,b,b');
  })
//now to trying this on the actual board: fails still exactly like it should...
  it("After one iteration, the blinker has switched to other direction", () => {
    const result = gameOfLife(1, "blinker.rle")//so 1 iteration, and the blinker should turn.
    expect(result.board[13].toString()).to.equal('b,b,b,b,b,b,b,b,b,b,b,b,b,b,o,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b')
    expect(result.board[14].toString()).to.equal('b,b,b,b,b,b,b,b,b,b,b,b,b,b,o,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b')
    expect(result.board[15].toString()).to.equal('b,b,b,b,b,b,b,b,b,b,b,b,b,b,o,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b')
  })

  it("After two iteration, the blinker has switched to original direction", () => {
    const result = gameOfLife(2, "blinker.rle")//so 1 iteration, and the blinker should turn.
    expect(result.board[13].toString()).to.equal('b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b')
    expect(result.board[14].toString()).to.equal('b,b,b,b,b,b,b,b,b,b,b,b,b,o,o,o,b,b,b,b,b,b,b,b,b,b,b,b,b,b')
    expect(result.board[15].toString()).to.equal('b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b,b')
  })

});
