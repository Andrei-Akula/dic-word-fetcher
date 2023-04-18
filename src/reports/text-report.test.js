const { makeTextReport } = require('./text-report')

const inputData = [
  {
    "original": "(į)(už)kopti, kopia, kopė į ką?",
    "words": [
      {
        "word": "kopti",
        "translation": [
          "восходить",
          "вынимать мёд"
        ],
        "frases": {
          "original": [
            [
              "kopti į kalną",
              " 1) лезть на гору; 2) подниматься на гору"
            ],
            [
              "kopti medų",
              " брать мёд"
            ]
          ],
          "native": [
            "kopti į kalną",
            "kopti medų"
          ],
          "translation": [
            "1) лезть на гору; 2) подниматься на гору",
            "брать мёд"
          ]
        },
        "examples": [
          "1 kop-ti, ~ia, ~ė lipti : K. į kalną, į medį. Į savo daržą gali ir per tvorą k.  .-prk. : Saulė vis aukščiau ~ė. ~ ėjas, ~ėja dkt.  ~ imas  2 kop-ti, ~ia, ~ė"
        ],
        "synonyms": [
          "žr. lipti"
        ]
      },
      {
        "word": "įkopti",
        "translation": [
          "взойти"
        ],
        "frases": {
          "original": [
            [
              "įkopti į kalną",
              " 1) взойти на гору; 2) подняться на гору"
            ]
          ],
          "native": [
            "įkopti į kalną"
          ],
          "translation": [
            "1) взойти на гору; 2) подняться на гору"
          ]
        },
        "examples": [
          "įkop-ti, ~ia, ~ė įlipti, užlipti: Į. į kalną, į medį. ~ imas"
        ],
        "synonyms": [
          "žr. įlipti"
        ]
      },
      {
        "word": "užkopti",
        "translation": [
          "взбираться"
        ],
        "frases": {
          "original": [
            [
              "užkopti ant kalno",
              " подняться на гору"
            ]
          ],
          "native": [
            "užkopti ant kalno"
          ],
          "translation": [
            "подняться на гору"
          ]
        },
        "examples": [
          "užkop-ti, ~ia, ~ė užlipti: ~ė ant kalno. ~ imas"
        ],
        "synonyms": []
      }
    ],
    "kristis": {
      "kopti": [
        {
          "word": "Kõpti",
          "class": "vksm.",
          "state": [
            "nesngr."
          ]
        },
        {
          "word": "Koptì",
          "class": "dlv.",
          "state": [
            "vyr.gim.",
            "būt.l.",
            "dgsk.",
            "V.",
            "neįvardž.",
            "nesngr.",
            "neveik.r."
          ]
        },
        {
          "word": "Koptì",
          "class": "dlv.",
          "state": [
            "vyr.gim.",
            "būt.l.",
            "dgsk.",
            "Š.",
            "neįvardž.",
            "nesngr.",
            "neveik.r."
          ]
        }
      ],
      "kopia": [
        {
          "word": "Kõpia",
          "class": "vksm.",
          "state": [
            "esam.l.",
            "IIIasm.",
            "vnsk.",
            "nesngr."
          ]
        },
        {
          "word": "Kõpia",
          "class": "vksm.",
          "state": [
            "esam.l.",
            "IIIasm.",
            "dgsk.",
            "nesngr."
          ]
        }
      ],
      "kopė": [
        {
          "word": "Kõpė",
          "class": "vksm.",
          "state": [
            "būt.kart.l.",
            "IIIasm.",
            "vnsk.",
            "nesngr."
          ]
        },
        {
          "word": "Kõpė",
          "class": "vksm.",
          "state": [
            "būt.kart.l.",
            "IIIasm.",
            "dgsk.",
            "nesngr."
          ]
        }
      ]
    }
  },
]

const outputText = `* * *

kopti į kalną
kopti medų

(į)(už)kopti, kopia, kopė į ką?

1) лезть на гору; 2) подниматься на гору
брать мёд

восходить
вынимать мёд


1 kop-ti, ~ia, ~ė lipti : K. į kalną, į medį. Į savo daržą gali ir per tvorą k.  .-prk. : Saulė vis aukščiau ~ė. ~ ėjas, ~ėja dkt.  ~ imas  2 kop-ti, ~ia, ~ė

synonyms: žr. lipti

---

įkopti į kalną

(į)(už)kopti, kopia, kopė į ką?

1) взойти на гору; 2) подняться на гору

взойти


įkop-ti, ~ia, ~ė įlipti, užlipti: Į. į kalną, į medį. ~ imas

synonyms: žr. įlipti

---

užkopti ant kalno

(į)(už)kopti, kopia, kopė į ką?

подняться на гору

взбираться


užkop-ti, ~ia, ~ė užlipti: ~ė ant kalno. ~ imas

synonyms: 


kristis

Kõpti (vksm. | nesngr.)
Koptì (dlv. | vyr.gim., būt.l., dgsk., V., neįvardž., nesngr., neveik.r.)
Koptì (dlv. | vyr.gim., būt.l., dgsk., Š., neįvardž., nesngr., neveik.r.)

Kõpia (vksm. | esam.l., IIIasm., vnsk., nesngr.)
Kõpia (vksm. | esam.l., IIIasm., dgsk., nesngr.)

Kõpė (vksm. | būt.kart.l., IIIasm., vnsk., nesngr.)
Kõpė (vksm. | būt.kart.l., IIIasm., dgsk., nesngr.)

`

describe('text-report', () => {
  test('makeTextReport should make proper report', () => {
    const text = makeTextReport(inputData)
    expect(text).toEqual(outputText)
  })
})