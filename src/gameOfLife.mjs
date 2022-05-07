import fs from 'fs';

export function parsePattern(data){
  let dimensions = data[0];
  let patternData = data[1];
  let result = [];
  for (let i = 0; i < dimensions.y; i++){
    result.push(new Array(dimensions.x));
  }
  let char = 0;
  for (let i = 0; i < dimensions.y; i++){
    for (let j = 0; j < dimensions.x+1; j++){
      if (patternData[char] === 'o' || patternData[char] === 'b') { 
        result[i][j] = patternData[char];
        char++;
      } else if (!isNaN(patternData[char])){
        for (let k = 0; k < parseInt(patternData[char]); k++){
          result[i][j+k] = patternData[char+1];
        }
        j++;
        char += 2;
      } else {
        char++;
      }
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

export function parsePatternData(data){
  data = data.split('\n');
  data = data.filter(elem => elem[0] != "#");
  let dimensionsString = data[0].split(', ru')[0];
  let dimensions = {};
  dimensions.x = dimensionsString.split('x = ')[1].split(',')[0]
  dimensions.y = dimensionsString.split('y = ')[1]
  const patternText = data[1];
  return [dimensions, patternText];
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
  for (let i = 0; i < size; i++) result.push(new Array(size));
  for (let i = smallestY; i < smallestY+size; i++){
    for (let j = smallestX; j < smallestX+size; j++ ){
      result[i - smallestY][j - smallestX] = board[i][j];
    }
  }
  return result;
}

export function drawOnBoard(board, pattern){
  let startY, startX;
  let middle = Math.floor(board.length / 2) - 1;
  if (pattern.length <= 2) startY = middle;
  else startY = middle - Math.floor(pattern.length / 2);
  if (pattern[0].length <= 2) startX = middle;
  else startX = middle - Math.floor(pattern[0].length / 2);
  for (let i = startY; i < pattern.length + startY; i++){
    for (let j = startX; j < pattern[0].length + startX; j++){
      board[i][j] = pattern[i-startY][j-startX];
    }
  }
  return board;
}

function writeToFile(resultPattern){
  fs.writeFileSync('result.rle', '');
  fs.writeFileSync('result.rle', 'x = ' + resultPattern[0].length + ', y = ' +resultPattern.length + ', rule = B3/S23\n');
  fs.writeFileSync('result.rle', rleEncoder(resultPattern), { flag: 'a+' });
}

export function gameOfLife(argIterations, argFile) {

  const file = process.argv[2] || argFile;
  const iterations = process.argv[3] || argIterations;

  let data = fs.readFileSync(file).toString();
  
  const pattern = parsePattern(parsePatternData(data));
  
  let board = initializeBoard(30);
  
  board = drawOnBoard(board, pattern);

  for (let i = 0; i < iterations; i++){
    board = updateBoard(board);
  }

  writeToFile(extractPattern(board));

  return { pattern, iterations, file, board };
}
