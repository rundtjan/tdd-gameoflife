import fs from 'fs';

export function gameOfLife() {
  const file = process.argv[2] || process.env.file ;
  fs.writeFileSync('result.rle', 'something');
  let data = fs.readFileSync(file).toString();
  data = data.split('\n');
  data = data.filter(elem => elem[0] != "#");
  const dimensions = data[0].split(', ru')[0];
  const pattern = data[1];
  return { file: file, dimensions: dimensions, pattern: pattern }
}

gameOfLife()
