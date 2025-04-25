
import React from 'react';

export default function SentenceStructure({ text, glossary }) {
  const words = text.split(" ").map(w => w.replace(/[.,!?%']/g, ''));

  return (
    <div className="mt-6">
      <h4 className="font-semibold mb-2">🧩 Satzstruktur (Subjekt/Verb/Objekt)</h4>
      <div className="space-y-1 text-sm">
        {words.map((word, idx) => {
          const entry = glossary[word.toLowerCase()];
          const role = entry?.category === "Verb"
            ? "Verb"
            : entry?.grammar?.toLowerCase().includes("subjekt")
              ? "Subjekt"
              : entry?.category === "Substantiv" || entry?.category?.includes("Artikel")
                ? "Objekt"
                : "";

          return role ? (
            <div key={idx}>
              <strong>{word}</strong> → <span className="italic text-gray-700">{role}</span>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}
