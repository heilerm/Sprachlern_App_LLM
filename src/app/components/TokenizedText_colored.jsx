
import React, { useEffect, useState } from 'react';
import GlossaryPopover from './GlossaryPopover_autoclose';

export default function TokenizedText({ text, glossary, cefrLevel, setHighlightedCategory }) {
  const [colorMap, setColorMap] = useState({});

  useEffect(() => {
       fetch('/word_class_colors.json')
      .then(res => res.json())
      .then(data => {
        console.log("📦 colorMap:", data); // ← HIER
        setColorMap(data);})
      .catch(err => console.error("Farbtabelle konnte nicht geladen werden:", err));
  }, []);
  console.log("📚 glossary:", glossary);
  return (
    <div className="mt-4 leading-8">
      {text.split(" ").map((word, idx) => {
        const cleanWord = word.replace(/[.,!?%']/g, '');
        const entry = glossary[cleanWord?.toLowerCase()];
        const colorClass = entry && entry.category ? (colorMap[entry.category] || 'bg-red-100 text-red-800') : 'bg-gray-100 text-gray-800';

        return (
          <span
            key={idx}
            className={`inline-block px-1 rounded ${colorClass}`}
            onMouseEnter={() => setHighlightedCategory(entry?.category || '')}
            onMouseLeave={() => setHighlightedCategory('')}
          >
            <GlossaryPopover
              word={cleanWord}
              glossary={glossary}
              cefrLevel={cefrLevel}
              colorClass=""
            />{" "}
          </span>
        );
      })}
    </div>
  );
}
