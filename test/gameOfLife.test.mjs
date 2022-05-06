import { expect } from "chai";
import { gameOfLife } from "../src/gameOfLife.mjs";

describe("Tests for game of life", () => {
  it("Example test", () => {
    expect(gameOfLife()).to.equal('blinker.rle');
  });
});
