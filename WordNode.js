
const TranslatedWordNode = {
  original,
  words: [{
    translation: {
      word, // word to translate
      transcription, // for English
      translation, // Lietuvių—rusų kalbų žodynas (if present)
      meaning,  // e.g. in English words
      frases: ` 
      smėlio laikrodis- 1) склянка; 2) песочные часы
      rupus smėlis- 1) крупный песок; 2) грубый песок
      lakusis smėlis- 1) зыбун; 2) зыбучий; 3) сыпучий песок
      `, // Išraiškos/posakiai
      forms: 'pamirš-ti, ~ta, ~o', // Dabartinės lietuvių kalbos žodynas
      examples: `
      pamirš-ti, ~ta, ~o nebeatminti, iš atminties išeiti, užmiršti: ~au uždaryti langą. ~ imas
      `, // Dabartinės lietuvių kalbos žodynas
      synonyms: 'out of doors',
      antonyms: 'indoors',
      error,
    },
    anki: {
      note: [front, back]
    }
  }],
  kristis: {
    "banguoti": [
      { "word": "Bangúoti", "class": "bdvr.", "state": ["vyr.gim.", "dgsk.", "V.", "neįvardž."] }, 
      { "word": "Bangúoti", "class": "bdvr.", "state": ["vyr.gim.", "dgsk.", "Š.", "neįvardž."] }, 
      { "word": "Bangúoti", "class": "vksm.", "state": ["nesngr."] }, 
      { "word": "Bangúoti", "class": "dlv.", "state": ["vyr.gim.", "būt.l.", "dgsk.", "V.", "neįvardž.", "nesngr.", "neveik.r."] }, 
      { "word": "Bangúoti", "class": "dlv.", "state": ["vyr.gim.", "būt.l.", "dgsk.", "Š.", "neįvardž.", "nesngr.", "neveik.r."] }
    ]
  }, // from http://kirtis.info/api/krc/
  
}