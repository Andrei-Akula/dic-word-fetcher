
const R = require('ramda')
const { matchAll, matchAllTrimed, replaceAll } = require('../regex-helpers')

const TRACE = m => a => (console.log(m, a), a)

/**
 *  extractPartBeforeFirstComma :: string -> string
 */
const extractPartBeforeFirstComma = R.compose(R.head, R.split(','))




// const prefixInParenthesesRex = /\((?<prefix>[^\)]+)\)(?<word>\w*)/g
const prefixRex = /\(([^\)]+)\)/g
const extractPrefixes = matchAll(prefixRex)
const removePrefixes = replaceAll(prefixRex)


/**
 * makeWordNode :: string -> { string, string[] } 
 */
const makeWordNode = original => {
  const firstPart = extractPartBeforeFirstComma(original)
  const firstWord = removePrefixes(firstPart)

  const makePrefixWords = R.compose(R.map(p => `${p}${firstWord}`), extractPrefixes)

  const prefixWords = makePrefixWords(firstPart)

  const words = R.insert(0, firstWord, prefixWords)

    return {
      original,
      words,
  }
}

const selectContentText = node => {
  const contentNode = node.querySelector('#content')
  contentNode.querySelectorAll('div').forEach(n => n.remove())
  return contentNode.textContent.trim()
}

const ltRuTranslationRex = /(?<=Lietuvių—rusų kalbų žodynas)\s*\n([^A-Z]*)/gm // Lietuvių—rusų kalbų žodynas
const extractLtRuTranslation = matchAllTrimed(ltRuTranslationRex)

const ruTranslationRex = /(?<=\d\))\s+([а-яё a-ząčęėįšųūž]+)\s*/gm // ru translations
const extractRuTranslation = matchAllTrimed(ruTranslationRex)

const extractLtRuTranslationSplit = R.compose(R.flatten, R.map(extractRuTranslation), extractLtRuTranslation)

const examplesRex = /(?<=Dabartinės lietuvių kalbos žodynas)\s*-(\s[^\n]*)/gm // Dabartinės lietuvių kalbos žodynas
const extractExamples = matchAllTrimed(examplesRex)

const examplesRemoveRex = /Dabartinės lietuvių kalbos žodynas\s*-\s[^\n]*/gm // Dabartinės lietuvių kalbos žodynas
const removeExamples = replaceAll(examplesRemoveRex)

const frasesRex = /(?<=Išraiškos\/posakiai)\s*([-),;\s\dа-яёa-ząčęėįšųūž]*)/gm
const extractFrases = matchAllTrimed(frasesRex)

const synonymsRex = /(?<=Sinonimų žodynas)\s*-(\s[^\n]*)/gm // Sinonimų žodynas
const extractSynonyms = matchAllTrimed(synonymsRex)

const synonymsRemoveRex = /Sinonimų žodynas\s*-\s[^\n]*/gm // Sinonimų žodynas
const removeSynonyms = replaceAll(synonymsRex)

/**
 * makeTranslatedNode :: string -> string -> TranslatedNode
 */
const makeTranslatedNode = word => content => {
  let translation = extractLtRuTranslationSplit(content)
  const examples = extractExamples(content)
  
  // const originalFrases = extractFrases(content)
  const splitFrases = R.compose(R.map(R.compose(R.split('-'), R.trim)), R.flatten, R.map(R.split('\n')), extractFrases)
  
  const originalFrases = splitFrases(content)
  
  const getLtFrases = R.compose(R.flatten, R.map(R.head))
  const getRuFrases = R.compose(R.map(R.trim), R.flatten, R.map(R.tail))

  const frases = {
    original: originalFrases,
    native: getLtFrases(originalFrases),
    translation: getRuFrases(originalFrases)
  }

  const synonyms = extractSynonyms(content)

  if (R.isEmpty(translation)) {
    const removeExamplesSynonymsGetRuTranslation = R.compose(extractRuTranslation, removeSynonyms, removeExamples)
    translation = removeExamplesSynonymsGetRuTranslation(content)
  }

  return {
    word,
    translation,
    frases,
    examples,
    synonyms
  }
}

const makeErrorTranslatedNode = word => error => ({
  word,
  translation: [],
  frases: [],
  examples: [],
  synonyms: [],
  error,
})

/**
 *  mergeWordNodesWithTranslatedNode = WordNode[] -> TranslatedNode[] -> WordNode[]
 */
const mergeWordNodesWithTranslatedNode = wordNodes => translatedNodes => {
  // const findTranslatedNode = word => R.find(R.propEq('word', word), translatedNodes)
  const findTranslatedNode = word => R.find(node => node.word === word, translatedNodes)

  const wordsLens = R.lensProp('words')
  return R.map(R.over(wordsLens, R.map(findTranslatedNode)), wordNodes)
}


const verbsRex = /([a-ząčęėįšųūž]+),\s([a-ząčęėįšųūž]+),\s([a-ząčęėįšųūž]+)/gm
const extractVerbs = matchAll(verbsRex)

const getFirstPartSplitWordFrase = R.compose(R.split(' '), extractPartBeforeFirstComma)
const isPerPrefixPresent = R.compose(R.includes('per'), extractPrefixes)

/**
 * makeList4Kirtis :: string -> string[]
 */
const makeList4Kirtis = line => {
  const verbs = extractVerbs(line)

  if (R.isEmpty(verbs)) {
    return getFirstPartSplitWordFrase(line)
  }

  if (isPerPrefixPresent(line)) {
    const addToVerbs = R.concat(verbs)
    const makeVerbsWithPrefix = R.compose(addToVerbs, R.map(word => `per${word}`))
    return makeVerbsWithPrefix(verbs)
  }

  return verbs
}

/**
 * mergeWordNodesWithKristis :: WordNode[] -> object -> WordNode[]
 */
const mergeWordNodesWithKristis = wordNodes => kristisListMapped => {
  const makeKristisObject = list => R.pick(list, kristisListMapped)

  const kristisLens = R.lensProp('kristis')
  return R.map(R.over(kristisLens, makeKristisObject), wordNodes)
}

module.exports = {
  makeErrorTranslatedNode,
  makeList4Kirtis,
  makeTranslatedNode,
  makeWordNode,
  mergeWordNodesWithKristis,
  mergeWordNodesWithTranslatedNode,
  selectContentText,
}