// glossary_generator.js (mit CEFR-Level + Debugging)

export function generateGlossary(text) {
  const dictionary = {
    il: { translation: "der", category: "bestimmter Artikel", cefr_level: "A1" },
    la: { translation: "die", category: "bestimmter Artikel", cefr_level: "A1" },
    un: { translation: "ein", category: "unbestimmter Artikel", cefr_level: "A1" },
    una: { translation: "eine", category: "unbestimmter Artikel", cefr_level: "A1" },
    caffè: { translation: "Kaffee", category: "Substantiv", cefr_level: "A1" },
    giornale: { translation: "Zeitung", category: "Substantiv", cefr_level: "A1" },
    prende: { translation: "nimmt", category: "Verb", cefr_level: "A1" },
    legge: { translation: "liest", category: "Verb", cefr_level: "A1" },
    ogni: { translation: "jeden", category: "Pronomen", cefr_level: "A2" },
    mattina: { translation: "Morgen", category: "Substantiv", cefr_level: "A1" },
    e: { translation: "und", category: "Konjunktion", cefr_level: "A1" },
    anna: { translation: "Anna", category: "Eigenname", cefr_level: "A1" },
    mangiare: { translation: "essen", category: "Verb", cefr_level: "A2" },
    guardiamo: { translation: "wir schauen", category: "Verb", cefr_level: "B1" }
  };

  const glossary = {};
  const words = text.split(" ").map(w => w.replace(/[.,!?%']/g, '').toLowerCase());

  console.log("📥 Eingegebener Text:", text);
  console.log("🧠 Tokenized:", words);

  words.forEach(word => {
    if (!glossary[word]) {
      console.log("🔍 Prüfe Wort:", word, "→", dictionary[word]);
      if (dictionary[word]) {
        glossary[word] = {
          word: word,
          translation: dictionary[word].translation,
          category: dictionary[word].category,
          grammar: "-",
          cefr_level: dictionary[word].cefr_level
        };
      } else {
        const isVerb = word.endsWith("are") || word.endsWith("ere") || word.endsWith("ire");
        glossary[word] = {
          word,
          translation: "(?)",
          category: isVerb ? "Verb" : "Unbekannt",
          grammar: "-",
          cefr_level: "?"
        };
      }
    }
  });

  console.log("📦 Generiertes Glossar:", glossary);
  return glossary;
}