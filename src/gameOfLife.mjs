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

export function initializeBoard(size){
  let board = [];
  for (let i = 0; i < size; i++) board.push(new Array(size));
  for (let i = 0; i < size; i++){
    for (let j = 0; j < size; j++){
      board[i][j] = 'b';
    }
  }
  return board;
}

export function neighbours(board, y, x){
  let neighbours = 0;
  for (let i = Math.max(0, y-1); i < Math.min(board.length, y+2); i++){
    for (let j = Math.max(0, x-1); j < Math.min(board.length, x+2); j++){
      if (board[i][j] === 'o' && (i != y || j != x)) {neighbours++;}
    }
  }
  return neighbours;
}

export function updateBoard(board){
  let result = [];
  board.forEach(()=> result.push(new Array(board.length)));
  let surround = 0;
  for (let i = 0; i < board.length; i++){
    for (let j = 0; j < board.length; j++){
      surround = neighbours(board, i, j);
      if (surround > 3) result[i][j] = 'b';
      else if (surround === 3) result[i][j] = 'o';
      else if (surround === 2) board[i][j] === 'o' ? result[i][j] = 'o' : result[i][j] = 'b';
      else result[i][j] = 'b';
    }
  }
  return result;
}

export function rleEncoder(data){
  let result = '';
  let current = data[0][0];
  let counter = 1;
  for (let i = 0; i < data.length; i++){
    for (let j = 0; j < data[0].length; j++){
      if (j === 0) continue;
      if (data[i][j] === current) counter++;
      else {
        counter === 1 ? result += current : result += counter+current;
        current = data[i][j];
        counter = 1;
      }
      if (j === data.length-1) {
        counter === 1 ? result += current : result += counter+current;
        if (i != data.length-1){
          result += '$';
          current = data[i+1][0];
          counter = 1;
        } else {
          result += '!';
        }
      }
    }
  }
  return result;
}

export function extractPattern(board){
  let [smallestY, smallestX, biggestY, biggestX]= [board.length, board.length, -1, -1];
  for (let i = 0; i < board.length; i++){
    for (let j = 0; j < board.length; j++){
      if (board[i][j] != 'b'){
        smallestX = Math.min(j, smallestX);
        biggestX = Math.max(j, biggestX);
        smallestY = Math.min(i, smallestY);
        biggestY = Math.max(i, biggestY);
      }
    }
  }
  let width = biggestX - smallestX + 1;
  let height = biggestY - smallestY + 1;
  let size = Math.max(width, height);
  let result = []
  for (let i = 0; i < size; i++) result.push(new Array(size));//this was were we finished in the last test
  for (let i = smallestY; i < smallestY+size; i++){
    for (let j = smallestX; j < smallestX+size; j++ ){
      result[i - smallestY][j - smallestX] = board[i][j];
    }
  }//this here paints or renders the pattern into the result 2d-array, let's test it!
  return result;
}

export function gameOfLife(argIterations, argFile) {
  let result = {};
  const file = process.argv[2] || argFile;
  const iterations = process.argv[3] || argIterations;
  result.iterations = iterations
  result.file = file;
  fs.writeFileSync('result.rle', '');
  let data = fs.readFileSync(file).toString();
  data = data.split('\n');
  data = data.filter(elem => elem[0] != "#");
  const dimensions = data[0].split(', ru')[0];
  result.dimensions = dimensions;
  const patternText = data[1];
  result.patternText = patternText;
  result.pattern = parsePattern(patternText);

  let board = initializeBoard(30);

  for (let i = 0; i < board.length; i++){
    for (let j = 0; j < board.length; j++){
      if (i === 14 && [13, 14, 15].includes(j)) {board[i][j] = result.pattern[j-13];}
    }
  }



  fs.writeFileSync('result.rle', 'x = 30, y = 30, rule = B3/S23\n');

  for (let i = 0; i < iterations; i++){
    board = updateBoard(board);
  }

  let resultPattern = extractPattern(board);
  fs.writeFileSync('result.rle', 'x = ' + resultPattern[0].length + ', y = ' +resultPattern.length + ', rule = B3/S23\n');
  fs.writeFileSync('result.rle', rleEncoder(resultPattern), { flag: 'a+' });
  
  result.board = board;

  return result;
}

