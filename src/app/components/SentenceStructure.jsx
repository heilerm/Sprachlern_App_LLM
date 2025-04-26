"use client";

import React, { useEffect, useState } from "react";

export default function SentenceStructure({ text, world }) {
  const [hoveredType, setHoveredType] = useState(null);
  const [clickedWord, setClickedWord] = useState(null);
  const [dictionary, setDictionary] = useState(null);

  useEffect(() => {
    fetch("/dictionaryDetails.json")
      .then((res) => res.json())
      .then((data) => setDictionary(data));
  }, []);

  if (!text || !dictionary) {
    return <p className="text-gray-400 italic">⏳ Wörterbuch wird geladen...</p>;
  }

  const words = text.split(/\s+/);

  const cleanWord = (word) => 
    word
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Akzente entfernen
      .replace(/[.,!?;:()\"'„“]/g, "") // Satzzeichen entfernen
      .trim();

  const analyzeWord = (word) => {
    const cleaned = cleanWord(word);
    if (dictionary[cleaned]) {
      return dictionary[cleaned].category.toLowerCase();
    }
    return "unknown";
  };

  const handleWordClick = (word) => {
    const cleaned = cleanWord(word);
    if (dictionary[cleaned]) {
      setClickedWord({ word: cleaned, ...dictionary[cleaned] });
    } else {
      setClickedWord(null);
    }
  };

  const getColor = (type) => {
    switch (type) {
      case "substantiv":
        return "bg-blue-100";
      case "verb":
        return "bg-green-100";
      case "adjektiv":
        return "bg-yellow-100";
      case "adverb":
        return "bg-purple-100";
      case "unbestimmter artikel":
      case "bestimmter artikel":
        return "bg-pink-100";
      case "eigenname":
        return "bg-orange-100";
      case "präposition":
        return "bg-indigo-100";
      default:
        return "bg-gray-100";
    }
  };

  const legend = [
    { label: "Substantiv", color: "bg-blue-100", match: "substantiv" },
    { label: "Verb", color: "bg-green-100", match: "verb" },
    { label: "Adjektiv", color: "bg-yellow-100", match: "adjektiv" },
    { label: "Adverb", color: "bg-purple-100", match: "adverb" },
    { label: "Bestimmter Artikel", color: "bg-pink-100", match: "bestimmter artikel" },
    { label: "Unbestimmter Artikel", color: "bg-pink-100", match: "unbestimmter artikel" },
    { label: "Eigenname", color: "bg-orange-100", match: "eigenname" },
    { label: "Präposition", color: "bg-indigo-100", match: "präposition" },
    { label: "Unbekannt", color: "bg-gray-100", match: "unknown" },
  ];

  return (
    <div className="relative">
      <p className="flex flex-wrap">
        {words.map((word, index) => {
          const wordType = analyzeWord(word);
          return (
            <span
              key={index}
              onMouseEnter={() => setHoveredType(wordType)}
              onMouseLeave={() => setHoveredType(null)}
              onClick={() => handleWordClick(word)}
              className={`inline-block rounded px-2 py-0.5 mr-2 mb-2 cursor-pointer ${getColor(wordType)} ${hoveredType === wordType ? "ring-2 ring-indigo-400" : ""}`}
            >
              {word}
            </span>
          );
        })}
      </p>

      {/* Farblegende */}
      <div className="mt-6">
        <h4 className="font-semibold text-gray-700 mb-2">Farblegende:</h4>
        <div className="grid grid-cols-2 gap-2">
          {legend.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center p-2 rounded ${item.color} ${hoveredType === item.match ? "ring-2 ring-indigo-400" : ""}`}
            >
              <span className="text-gray-800 text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Popup bei Klick */}
      {clickedWord && (
        <>
          {/* Nur wenn ein echtes Wort angeklickt wurde, wird der Hintergrund gezeigt */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setClickedWord(null)}
          ></div>

          {/* Popup-Box */}
          <div className="fixed bottom-10 right-10 bg-white p-4 rounded-xl shadow-lg border border-indigo-300 max-w-sm z-50">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold capitalize">{clickedWord.word}</h3>
              <button
                onClick={() => setClickedWord(null)}
                className="text-gray-500 hover:text-red-500 text-xl font-bold"
              >
                ×
              </button>
            </div>
            <p><span className="font-semibold">Bedeutung:</span> {clickedWord.meaning}</p>
            <p><span className="font-semibold">Kategorie:</span> {clickedWord.category}</p>
            <p><span className="font-semibold">Grammatik:</span> {clickedWord.grammar}</p>
            <p><span className="font-semibold">CEFR-Level:</span> {clickedWord.cefr}</p>
            <p><span className="font-semibold">Kultureller Kontext:</span> {clickedWord.culture}</p>
            {clickedWord.video && (
              <p className="mt-2 text-sm">
                📺{" "}
                <a
                  href={clickedWord.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 underline hover:text-indigo-800"
                >
                  YouTube: Gendern in Sprache?
                </a>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
