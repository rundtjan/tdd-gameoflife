import { gameOfLife } from './src/gameOfLife.mjs'

console.log(process.argv)
gameOfLife(process.argv[3], process.argv[2])