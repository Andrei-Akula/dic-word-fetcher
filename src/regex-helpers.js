const matchAll = re => str => Array.from(str.matchAll(re)).flatMap(r => r.slice(1))
const matchAllTrimed = re => str => Array.from(str.matchAll(re)).flatMap(r => r.slice(1)).map(a => a.trim())
const replaceAll = re => str => str.replaceAll(re, '')

module.exports = {
  matchAll,
  replaceAll,
  matchAllTrimed
}