import React, { useEffect, useState } from 'react';

export default function DragAndDropSentence({ correctOrder }) {
  const [shuffled, setShuffled] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    setShuffled([...correctOrder].sort(() => 0.5 - Math.random()));
  }, [correctOrder]);

  function handleDragStart(e, index) {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function handleDrop(e, targetIndex) {
    e.preventDefault();
    const newOrder = [...shuffled];
    const [moved] = newOrder.splice(draggedItem, 1);
    newOrder.splice(targetIndex, 0, moved);
    setShuffled(newOrder);
    setDraggedItem(null);
  }

  function checkOrder() {
    if (shuffled.join(" ") === correctOrder.join(" ")) {
      setFeedback("✅ Satzstellung korrekt!");
    } else {
      setFeedback("❌ Nicht korrekt. Tipp: Im Italienischen steht das direkte Objekt meist nach dem Verb.");
    }
  }

  return (
    <div className="mt-6">
      <h3 className="font-bold mb-2">Satzstellungs-Spiel</h3>
      <div className="flex flex-wrap gap-2 mb-2">
        {shuffled.map((word, idx) => (
          <div
            key={idx}
            draggable
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, idx)}
            className="px-2 py-1 border rounded bg-gray-100 cursor-move hover:bg-gray-200 transition-colors"
          >
            {word}
          </div>
        ))}
      </div>
      <button onClick={checkOrder} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors">
        Prüfen
      </button>
      <div className="mt-2 text-sm">{feedback}</div>
    </div>
  );
}
