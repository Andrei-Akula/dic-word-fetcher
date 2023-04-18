const lietuviuZodynas = require('./lietuviuzodynas')

describe('lietuviuzodynas', () => {
  test('makeList4Kirtis', () => {
    const testFrases = [
      { in: 'erdvus, -i', out: ['erdvus'] },
      { in: 'gėlas vanduo, -a', out: ['gėlas', 'vanduo'] },
      { in: 'tekėti, teka, tekėjo', out: ['tekėti', 'teka', 'tekėjo'] },
      { in: '(į)(už)kopti, kopia, kopė į ką?', out: ['kopti', 'kopia', 'kopė'] },
      { in: '(nu)leistis, leidžiasi, leidosi nuo ko?', out: ['leistis', 'leidžiasi', 'leidosi'] },
      { in: '(pa)(per)skaityti, skaityti, skaito ką?', out: ['skaityti', 'skaityti', 'skaito', 'perskaityti', 'perskaityti', 'perskaito'] },      
    ]

    testFrases.forEach(fraseObj => {
      expect(lietuviuZodynas.makeList4Kirtis(fraseObj.in)).toEqual(fraseObj.out)
    })
  })

  test('makeWordNode', () => {
    const testFrases = [
      {
        original: 'erdvus, -i',
        words: ['erdvus'],
      },
      {
        original: 'gėlas vanduo, -a',
        words: ['gėlas vanduo'],
      },
      {
        original: 'tekėti, teka, tekėjo',
        words: ['tekėti'],
      },
      {
        original: '(į)(už)kopti, kopia, kopė į ką?',
        words: ['kopti', 'įkopti', 'užkopti'],
      },
      {
        original: '(nu)leistis, leidžiasi, leidosi nuo ko?',
        words: ['leistis', 'nuleistis'],
      },
      {
        original: '(pa)(per)skaityti, skaityti, skaito ką?',
        words: ['skaityti', 'paskaityti', 'perskaityti'],
      },  
    ]

    testFrases.forEach(fraseObj => {
      expect(lietuviuZodynas.makeWordNode(fraseObj.original)).toEqual(fraseObj)
    })    
  })
})