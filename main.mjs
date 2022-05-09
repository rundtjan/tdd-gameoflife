import { gameOfLife } from './src/gameOfLife.mjs'

console.log(process.argv)
//gameOfLife(process.argv[3], process.argv[2])
//console.log('no linebreaks'.split('\n'))

let result = "30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$13b3o14b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b13b3o14b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b$30b!"

//if (result.split('\n')[result.split('\n').length-1].length > 70) result = result.substring(0,70) + '\n' + result.substring(70,result.length)

while(result.split('\n')[result.split('\n').length-1].length > 70){
  result = result.substring(0, result.length - result.split('\n')[result.split('\n').length-1].length + 70) + '\n' + result.substring(result.length - result.split('\n')[result.split('\n').length-1].length+70, result.length);
} 

console.log(result)
