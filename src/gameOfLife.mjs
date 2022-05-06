import fs from 'fs';

function parsePattern(patternText){
  let patternData = patternText.split('')
  let result = [];
  for (let i = 0; i < patternData.length-1; i++){
    if (patternData[i] === 'o' || patternData[i] === 'b') result.push(patternData[i])
    else if (!isNaN(patternData[i])){
      for (let j = 0; j < patternData[i]; j++) {
        result.push(patternData[i+1]);
      }
      i++;
    }
  }
  return result;
}

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
  const patternText = data[1];
  result.patternText = patternText;
  result.pattern = parsePattern(patternText);
  const board = [];
  for (let i = 0; i < 30; i++) board.push(new Array(30));
  for (let i = 0; i < board.length; i++){
    for (let j = 0; j < board.length; j++){
      board[i][j] = 'b';
    }
  }
  result.startBoard = board.slice();
  result.drawnBoard = board.slice();

  return result;
}

