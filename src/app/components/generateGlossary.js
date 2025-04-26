export function generateGlossary(text) {
  const simplePreps = ["di", "a", "in", "con", "su", "per", "tra", "fra"];
  const compoundPreps = [
    "del", "della", "dello", "dei", "degli",
    "nel", "nella", "nello", "nei", "negli",
    "al", "alla", "allo", "ai", "agli",
    "sul", "sulla", "sullo", "sui", "sugli"
  ];
  const specialPreps = ["durante", "tranne", "salvo", "eccetto", "secondo", "verso", "sopra", "sotto"];

  const glossary = {};
  const cleanedWords = (text.toLowerCase().match(/[a-zàèéìòùáéíóúüñœçßöä]+/gi) || []);

  for (const w of cleanedWords) {
    if (simplePreps.includes(w)) {
      glossary[w] = { word: w, type: "preposition", subtype: "simple" };
    } else if (compoundPreps.includes(w)) {
      glossary[w] = { word: w, type: "preposition", subtype: "compound" };
    } else if (specialPreps.includes(w)) {
      glossary[w] = { word: w, type: "preposition", subtype: "special" };
    }
  }

  return glossary;
}