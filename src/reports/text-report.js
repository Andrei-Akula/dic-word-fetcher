const R = require('ramda')

const originalWordLens = R.lensProp('original')
const wordsLens = R.lensProp('words')
const kristisLens = R.lensProp('kristis')

const wordFrasesOrgLens = R.lensPath(['frases', 'native'])
const wordFrasesTransLens = R.lensPath(['frases', 'translation'])

const wordTranslatedLens = R.lensProp('translation')
const wordExamplesLens = R.lensProp('examples')
const wordSynonymsLens = R.lensProp('synonyms')

const wordLens = R.lensProp('word')
const classLens = R.lensProp('class')
const stateLens = R.lensProp('state')

const getFrasesOrg = R.compose(R.join('\n'), R.view(wordFrasesOrgLens))
const getFrasesTrans = R.compose(R.join('\n'), R.view(wordFrasesTransLens))
const getTranslated = R.compose(R.join('\n'), R.view(wordTranslatedLens))
const getExamples = R.compose(R.join('\n'), R.view(wordExamplesLens))
const getSynonyms = R.compose(R.join(', '), R.view(wordSynonymsLens))

const makeWordReport = original => word => `${getFrasesOrg(word)}

${original}

${getFrasesTrans(word)}

${getTranslated(word)}


${getExamples(word)}

synonyms: ${getSynonyms(word)}
`

const getStates = R.compose(R.join(', '), R.view(stateLens))
const makeKristisItemReport = item =>  `${R.view(wordLens, item)} (${R.view(classLens, item)} | ${getStates(item)})`
const makeKristisItemsReport = R.compose(R.join('\n'), R.map(makeKristisItemReport))
const makeKristisReport = R.compose(R.join('\n\n'), R.map(makeKristisItemsReport), R.values)

const makeWordNodeText = wordNode => {
  const original = R.view(originalWordLens, wordNode)
  const makeWordsReport = R.compose(R.join('\n---\n\n'), R.map(makeWordReport(original)))

  const words = R.view(wordsLens, wordNode)
  const kristis = R.view(kristisLens, wordNode)

  return `* * *

${makeWordsReport(words)}

kristis

${makeKristisReport(kristis)}

`
}

const makeTextReport = R.compose(R.join('\n'), R.map(makeWordNodeText))

module.exports = {
  makeTextReport
}