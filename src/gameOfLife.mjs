export function gameOfLife() {
  const file = process.argv[2] || process.env.file ;
  return file
}

gameOfLife()
