"use client";

import React, { useEffect, useState } from "react";
import { generateGlossary } from "./generateGlossary";
import TextLevelAnalyzer from "./TextLevelAnalyzer";
import SentenceStructure from "./SentenceStructure";

export default function DropZoneWithFeatures({ level, world }) {
  const [droppedText, setDroppedText] = useState("");
  const [glossary, setGlossary] = useState({});

  // --- Text löschen beim World-Wechsel ---
  useEffect(() => {
    setDroppedText("");
    setGlossary({});
  }, [world]);

  const handleDrop = (event) => {
    event.preventDefault();
    const text = event.dataTransfer.getData("text");
    setDroppedText(text);
    const glossaryData = generateGlossary(text);
    setGlossary(glossaryData);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const glossaryArray = Object.values(glossary);
  const simple = glossaryArray.filter((w) => w.subtype === "simple");
  const compound = glossaryArray.filter((w) => w.subtype === "compound");
  const special = glossaryArray.filter((w) => w.subtype === "special");

  const isHigherLevel = ["B1", "B2", "C1", "C2"].includes(level);

  const renderColoredPrep = (prep) => (
    <span
      key={prep.word}
      className="inline-block bg-yellow-100 text-gray-900 rounded px-2 py-0.5 mr-2 mb-1"
    >
      {prep.word}
    </span>
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="max-w-[600px] w-full overflow-auto p-6 border-2 border-dashed border-indigo-400 bg-white rounded-xl shadow"
    >
      {droppedText ? (
        <>
          <div className="mb-6">
            <p className="font-medium text-gray-800 mb-2">📄 Eingegebener Text:</p>
            <p className="bg-gray-100 p-2 rounded whitespace-pre-wrap">{droppedText}</p>
          </div>

          {/* --- Präpositionen Darstellung --- */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Gefundene Präpositionen:</h3>

            {!isHigherLevel ? (
              <div className="flex flex-wrap">
                {glossaryArray.length > 0 ? glossaryArray.map(renderColoredPrep) : (
                  <span className="text-gray-400">Keine Präpositionen gefunden</span>
                )}
              </div>
            ) : (
              <>
                {simple.length > 0 && (
                  <div className="mb-4">
                    <p className="font-semibold text-sm text-gray-800 mb-1">Einfache Präpositionen</p>
                    <div className="flex flex-wrap">
                      {simple.map(renderColoredPrep)}
                    </div>
                  </div>
                )}
                {compound.length > 0 && (
                  <div className="mb-4">
                    <p className="font-semibold text-sm text-gray-800 mb-1">Zusammengesetzte Präpositionen</p>
                    <div className="flex flex-wrap">
                      {compound.map(renderColoredPrep)}
                    </div>
                  </div>
                )}
                {special.length > 0 && (
                  <div className="mb-4">
                    <p className="font-semibold text-sm text-gray-800 mb-1">Spezielle Präpositionen</p>
                    <div className="flex flex-wrap">
                      {special.map(renderColoredPrep)}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* --- Trennlinie --- */}
          <hr className="border-t border-gray-300 my-6" />

          {/* --- Satzstruktur Darstellung --- */}
          <SentenceStructure text={droppedText} world={world} />

          {/* --- Textlevel Analyzer Darstellung --- */}
          <TextLevelAnalyzer text={droppedText} glossary={glossaryArray} level={level} />
        </>
      ) : (
        <div className="text-center text-gray-500 p-6 animate-pulse">
          ✨Ziehe einen Text oder markierten Satz/Satzteil aus dem Chat hier hinein,um ihn zu analysieren! ✨
        </div>
      )}
    </div>
  );
}
