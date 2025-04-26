"use client";
import React, { useEffect, useState } from "react";

export default function TextLevelAnalyzer({ text, level, world }) {
  const [dictionary, setDictionary] = useState({});

  useEffect(() => {
    fetch("/dictionary.json")
      .then((res) => res.json())
      .then((data) => {
        setDictionary(data);
      });
  }, []);

  if (!text || !dictionary[world]) {
    return null;
  }

  const words = text.toLowerCase().split(/\s+/);

  const examplePreps = {
    simple: ["di", "a", "in"],
    compound: ["del", "nel", "al"],
    special: ["tranne", "salvo", "durante"]
  };

  const categorized = {
    simple: [],
    compound: [],
    special: []
  };

  // Gehe alle Wörter durch und sortiere Präpositionen
  words.forEach((word) => {
    if ((dictionary[world].prepositions || []).includes(word)) {
      // Hier keine Unterscheidung nach Typen - bei Bedarf erweiterbar
      categorized.simple.push(word);
    }
  });

  const renderColored = (prep) => (
    <span key={prep} className="inline-block bg-yellow-100 text-gray-900 rounded px-2 py-0.5 mr-2 mb-1">
      {prep}
    </span>
  );

  const isHigherLevel = !["A1", "A2"].includes(level);

  return (
    <div>
      {isHigherLevel ? (
        <>
          {categorized.simple.length > 0 && (
            <div className="mb-4">
              <p className="font-semibold text-sm text-gray-800 mb-1">
                Einfache Präpositionen <span className="text-gray-500">(z. B. {examplePreps.simple.join(", ")})</span>
              </p>
              <div className="flex flex-wrap">
                {categorized.simple.map(renderColored)}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-1">Gefundene Präpositionen:</p>
          <div className="flex flex-wrap">
            {categorized.simple.length > 0 ? categorized.simple.map(renderColored) : <span className="text-gray-400">Keine Präpositionen gefunden</span>}
          </div>
        </div>
      )}
    </div>
  );
}
