const fs = require('node:fs')
const { 
  Async,
  compose2,
  constant,
  resultToAsync,
  tryCatch
} = require('crocks')

const readFileAsync = Async.fromNode(fs.readFile)

/**
 * readTextFileAsync :: string -> Async Err, string
 */
const readTextFileAsync = path => readFileAsync(path, 'utf8')


const writeFileAsync = Async.fromNode(fs.writeFile)

/**
 * writeTextFileAsync :: string -> string -> Async Err, string
 */
const writeTextFileAsync = path => text => 
    writeFileAsync(path, text, 'utf8')
      .map(constant(text))

// tryParse :: string -> Result Err, data
const tryParse = tryCatch(JSON.parse)

// tryStringify :: data -> Result Err, string
const tryStringify = tryCatch(d => JSON.stringify(d, null, 2))

/**
 * loadJsonFile :: string -> Async Err, object
 */
const loadJsonFileAsync = path => readFileAsync(fileName, 'utf-8').chain(compose2(resultToAsync, tryParse))

/**
 * writeJsonFileAsync :: string -> data -> Async Err, string
 */
const writeJsonFileAsync = path => data =>
    resultToAsync(tryStringify(data))
    .chain(text => writeFileAsync(path, text, 'utf8').map(constant(text)))


const fetchAsync = Async.fromPromise(fetch)

/**
 * fetchMethodAsync :: string -> string -> Async Err, string
 */
const fetchMethodAsync = method => url => fetchAsync(url).chain(Async.fromPromise(res => res[method]()))

/**
 * fetchTextAsync (get html text) :: string -> Async Err, string
 */
const fetchTextAsync = fetchMethodAsync('text')

/**
 * fetchJsonAsync (get json) :: string -> Async Err, string
 */
const fetchJsonAsync = fetchMethodAsync('json')

module.exports = {
  loadJsonFileAsync,
  writeJsonFileAsync,
  readTextFileAsync,
  writeTextFileAsync,
  fetchTextAsync,
  fetchJsonAsync
}