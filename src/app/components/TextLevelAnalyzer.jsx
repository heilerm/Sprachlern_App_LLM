
import React, { useEffect, useState } from 'react';

const CEFR_LEVELS = {
  A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6
};

const LEVEL_NAMES = {
  1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1', 6: 'C2'
};

export default function TextLevelAnalyzer({ text, glossary }) {
  const [level, setLevel] = useState('?');
  const [averageLevel, setAverageLevel] = useState('?');
  const [difficultWords, setDifficultWords] = useState([]);

  useEffect(() => {
    if (!text || !glossary) return;

    const tokens = text.toLowerCase().split(/\s+/).map(w => w.replace(/[.,!?]/g, ''));
    let max = 0;
    let total = 0;
    let count = 0;
    const difficult = [];

    tokens.forEach((word) => {
      const entry = glossary[word];
      if (entry && entry.cefr_level && CEFR_LEVELS[entry.cefr_level]) {
        const lvl = CEFR_LEVELS[entry.cefr_level];
        if (lvl >= 4) difficult.push({ word, level: entry.cefr_level });
        max = Math.max(max, lvl);
        total += lvl;
        count++;
      }
    });

    setLevel(LEVEL_NAMES[max] || '?');
    setAverageLevel(count > 0 ? LEVEL_NAMES[Math.round(total / count)] : '?');
    setDifficultWords(difficult);
  }, [text, glossary]);

  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h3 className="text-lg font-bold mb-2">📊 CEFR-Niveau-Auswertung</h3>
      <p><strong>Maximales Niveau:</strong> {level}</p>
      <p><strong>Durchschnittliches Wortniveau:</strong> {averageLevel}</p>
      {difficultWords.length > 0 && (
        <div className="mt-2">
          <p><strong>Schwierige Wörter (B2+):</strong></p>
          <ul className="list-disc list-inside text-sm">
            {difficultWords.map((dw, i) => (
              <li key={i}>{dw.word} (Level: {dw.level})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
