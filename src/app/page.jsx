"use client";
import { useState } from "react";

export default function HomePage() {
  const [currentWorld, setCurrentWorld] = useState("cafe");
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [toReview, setToReview] = useState({}); // Speichert Kategorien und Beispiele
  const [selectedLevel, setSelectedLevel] = useState("A1"); // Standardniveau

  const handleDrop = async (event) => {
    event.preventDefault();
    const text = event.dataTransfer.getData("text");

    // KI-Analyse oder einfache Schlüsselworterkennung
    const extractedContent = await analyzeText(text);

    // Beispiel: Kategorisierung basierend auf Schlüsselwörtern
    let category = "Sonstiges";
    if (extractedContent.includes("di") || extractedContent.includes("da")) {
      category = "Präpositionen";
    }

    // Speichere das Beispiel in der Kategorie
    setToReview((prev) => ({
      ...prev,
      [category]: [...(prev[category] || []), extractedContent],
    }));
  };

  const analyzeText = async (text) => {
    // Liste aller Präpositionen
    const keywords = ["di", "da", "a", "in", "su", "per", "con", "tra", "fra"];
    const words = text.split(" ");
    
    // Extrahiere nur die Präpositionen, die im Text vorkommen
    const extracted = words.filter((word) => keywords.includes(word));
    
    // Rückgabe: Alle Präpositionen, aber markiere die gefundenen
    return keywords.map((keyword) => (extracted.includes(keyword) ? keyword : keyword)).join(", ");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Überschrift und Dropdown */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Sprachwelt</h1>
        <select
          className="border border-gray-300 rounded px-3 py-2"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
        >
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
          <option value="C1">C1</option>
          <option value="C2">C2</option>
        </select>
      </div>

      {/* Welt-Auswahl */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          className="bg-white shadow px-4 py-2 rounded-xl hover:bg-indigo-100 transition"
          onClick={() => setCurrentWorld("cafe")}
        >
          Café
        </button>
        <button
          className="bg-white shadow px-4 py-2 rounded-xl hover:bg-indigo-100 transition"
          onClick={() => setCurrentWorld("hotel")}
        >
          Hotel
        </button>
        <button
          className="bg-white shadow px-4 py-2 rounded-xl hover:bg-indigo-100 transition"
          onClick={() => setCurrentWorld("markt")}
        >
          Markt
        </button>
      </div>

      {/* Hauptbereich: Chat und "Noch zu vertiefen" */}
      <div className="flex gap-6">
        {/* Chat-Bereich */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow">
          {/* Chat-Historie */}
          <div
            className="chat-history mb-4 max-h-64 overflow-y-auto border border-gray-300 rounded p-3"
          >
            {chat.map((entry, index) => (
              <div key={index} className="mb-2">
                <p className="text-blue-600 font-semibold">Benutzer: {entry.user}</p>
                <p
                  className="text-green-600"
                  draggable="true"
                  onDragStart={(e) => e.dataTransfer.setData("text", entry.response)}
                >
                  Barista: {entry.response}
                </p>
              </div>
            ))}
          </div>

          {/* Aktuelle Antwort der KI */}
          <p className="text-lg mb-4">
            🧠 KI-Barista:{" "}
            {chat.length > 0
              ? chat[chat.length - 1].response
              : "Buongiorno! Cosa desidera?"}
          </p>

          {/* Eingabefeld */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!input) return;

              setChat([...chat, { user: input, response: "..." }]);
              setInput("");

              // Echte KI-Antwort vom Server
              fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
              })
                .then((res) => res.json())
                .then((data) => {
                  setChat((prev) => [
                    ...prev.slice(0, -1),
                    { user: input, response: data.response },
                  ]);
                });
            }}
          >
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
              placeholder="Sag etwas zur Barista..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
            >
              Absenden
            </button>
          </form>
        </div>

        {/* Bereich für "Noch zu vertiefen" */}
        <div
          className="w-1/3 bg-gray-100 p-6 rounded-xl shadow"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <h2 className="text-2xl font-bold mb-4">Noch zu vertiefen</h2>
          <p className="text-sm text-gray-600 mb-4">
            Sie können zu vertiefende Texte aus dem Chat hier per Drag-and-Drop hineinziehen.
          </p>
          {Object.keys(toReview).map((category) => (
            <div key={category} className="mb-4">
              <h3 className="text-xl font-semibold">{category}</h3>
              <ul className="list-disc pl-6">
                {toReview[category].map((example, index) => (
                  <li key={index}>{example}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}