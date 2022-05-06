import fs from 'fs';

export function gameOfLife(argFile) {
  let result = {};
  const file = process.argv[2] || argFile ;
  result.file = file;
  fs.writeFileSync('result.rle', 'something');
  let data = fs.readFileSync(file).toString();
  data = data.split('\n');
  data = data.filter(elem => elem[0] != "#");
  const dimensions = data[0].split(', ru')[0];
  result.dimensions = dimensions;
  const pattern = data[1];
  result.pattern = pattern;
  const board = [];
  for (let i = 0; i < 30; i++) board.push(new Array(30));
  for (let i = 0; i < board.length; i++){
    for (let j = 0; j < board.length; j++){
      board[i][j] = 'o';
    }
  }
  result.startBoard = board.slice();

  return result;
}

