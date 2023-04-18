const { argv } = require('node:process')
const R = require('ramda')
const { program } = require('commander')
const HTMLParser = require('node-html-parser')
const { version, name, description } = require('./package')
const {
  Async, 
  coalesce,
  pipeK,
  fanout,
  Pair
} = require('crocks')

const {
  writeJsonFileAsync,
  readTextFileAsync,
  writeTextFileAsync,
  fetchTextAsync,
  fetchJsonAsync
} = require('./src/io')

const lietuviuZodynas = require('./src/content-parsers/lietuviuzodynas')
const { makeTextReport } = require('./src/reports/text-report')

// TODO: move options to a separate file
// TODO: use it with Async
program
  .name(name)
  .description(description)
  .version(version)

program
  .requiredOption('-i, --input <string>', 'path ot input text file with words')
  .requiredOption('-o, --output <string>', 'path to output file')
  .option('-j, --json', 'output in json format')
  .option('-d, --debug', 'output extra debugging')

program.parse(argv)

const options = program.opts()

// const ouputFilePath = options.output || `out-${options.input}`
// options.output = ouputFilePath

if (options.debug) console.log('options:', options)


// isNotEpmty :: string -> boolean
const isNotEpmty = R.complement(R.isEmpty)

/**
 * splitAndMapWordNode :: string -> WordNode[]
 */
const splitAndMapWordNode = R.pipe(
  R.split('\n'),
  R.filter(isNotEpmty), 
  R.map(R.compose(lietuviuZodynas.makeWordNode, R.trim))
)

/**
 * makePlaiList :: string -> object[] -> string[]
 */
const makePlainList = propName => R.compose(R.flatten, R.map(R.prop(propName)))

/**
 * makePlainWordList :: WordNode[] -> string[]
 */
const makePlainWordList = makePlainList('words')

/**
 * fetchTextFromLietuviuZodynasAsync :: string -> Async e, string
 */
const fetchTextFromLietuviuZodynasAsync = word =>  fetchTextAsync(`https://rusu.lietuviuzodynas.lt/rusiskai/${encodeURI(word)}`)


/**
 * fetchParseLtTranslation :: string -> Async ErrorTranslatedNode, TranslatedNode
 */ 
const fetchParseLtTranslationAsync = word => {
  const parseLtZodynasResponse = R.compose(lietuviuZodynas.makeTranslatedNode(word), lietuviuZodynas.selectContentText,  HTMLParser.parse)
  return coalesce(lietuviuZodynas.makeErrorTranslatedNode(word), parseLtZodynasResponse, fetchTextFromLietuviuZodynasAsync(word))
}

/**
 * readWordsMakeWordNodes :: string -> Async e, WordNode[]
 */
const readWordsMakeWordNodes = R.compose(R.map(splitAndMapWordNode), readTextFileAsync)

/**
 * fetchTanslationsAsync :: WordNode[] -> [Async ErrorTranslatedNode, TranslatedNode]
 */
const fetchTanslationsAsync = R.compose(R.map(fetchParseLtTranslationAsync), makePlainWordList)

/**
 * fetchTanslations :: WordNode[] -> Async e, WordNode[]
 */
const fetchTanslationsMergeNodesAsync = wordNodes => {
  return Async.all(fetchTanslationsAsync(wordNodes))  // -> [ErrorTranslatedNode || TranslatedNode]
    .map(lietuviuZodynas.mergeWordNodesWithTranslatedNode(wordNodes))
}

/**
 * capitalize :: string -> string
 */
const capitalize = R.converge(R.concat, [R.compose(R.toUpper, R.head), R.tail])

/**
 * fetchJsonFromKirtisAsync :: string -> Async e, json
 */
const fetchJsonFromKirtisAsync = R.compose(fetchJsonAsync, R.concat('http://kirtis.info/api/krc/'), encodeURI, capitalize)

/**
 * makeKristListForWordNodes :: WordNode[] -> WordNode[]
 * 
 * adds 'kristis' as string[]
 */
const makeKristListAnd2WordNodes = R.map(wn => R.assoc('kristis', lietuviuZodynas.makeList4Kirtis(wn.original), wn))

/**
 * makePlainKristisList :: WordNode[] -> string[]
 */
const makePlainKristisList = makePlainList('kristis')

/**
 * fetchKristisAsync :: WordNode[] -> [Async e, r]
 */
const fetchKristisAsync = R.map(fetchJsonFromKirtisAsync)

/**
 * fetchKristisMergeNodesAsync :: WordNode[] -> Async e, WordNode[]
 */
const fetchKristisMergeNodesAsync = wordNodes => {
  const kritisWordNodes = makeKristListAnd2WordNodes(wordNodes)
  const kristisPlainList = makePlainKristisList(kritisWordNodes)
  return Async.all(fetchKristisAsync(kristisPlainList))
    .map(R.zipObj(kristisPlainList))
    .map(lietuviuZodynas.mergeWordNodesWithKristis(kritisWordNodes))
}

const isJsonOptionApplied = R.has('json')
const writeFileAsync = isJsonOptionApplied(options) ? writeJsonFileAsync : writeTextFileAsync



const makeReport = isJsonOptionApplied(options) ? R.identity : makeTextReport

/**
 * readFetchProcessWords :: string -> Async e, r
 */
const readFetchProcessWords = pipeK(
  readWordsMakeWordNodes,
  fetchTanslationsMergeNodesAsync,
  fetchKristisMergeNodesAsync,
  R.compose(writeFileAsync(options.output), makeReport)
)



readFetchProcessWords(options.input).fork(
  e => console.error('Opps, there is an error! Look\n', e),
  r => console.log('done\n')
)