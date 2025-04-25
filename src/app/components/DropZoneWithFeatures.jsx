"use client";
import React, { useState } from "react";
import { generateGlossary } from "./generateGlossary";
import TextLevelAnalyzer from "./TextLevelAnalyzer";
import SentenceStructure from "./SentenceStructure";

export default function DropZoneWithFeatures() {
  const [droppedText, setDroppedText] = useState("");
  const [glossary, setGlossary] = useState({});

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

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="p-6 border-2 border-dashed border-indigo-400 bg-white rounded-xl shadow"
    >
      <h2 className="text-xl font-bold mb-4">Noch zu vertiefen (mit Features)</h2>
      <p className="text-gray-600 mb-4">
        Ziehe einen Text oder markierten Satz aus dem Chat hier hinein.
      </p>

      {droppedText && (
        <>
          <div className="mb-4">
            <p className="font-medium text-gray-800">📄 Eingegebener Text:</p>
            <p className="bg-gray-100 p-2 rounded">{droppedText}</p>
          </div>

          <SentenceStructure text={droppedText} glossary={glossary} />
          <TextLevelAnalyzer text={droppedText} glossary={Object.values(glossary)} />
        </>
      )}
    </div>
  );
}
