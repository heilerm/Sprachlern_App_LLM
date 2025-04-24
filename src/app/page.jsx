"use client";
import { useState } from "react";

export default function HomePage() {
  const [currentWorld, setCurrentWorld] = useState("cafe");
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [toReview, setToReview] = useState({}); // Speichert Kategorien und Beispiele
  const [categoryCounts, setCategoryCounts] = useState({}); // Zähler für Kategorien
  const [selectedLevel, setSelectedLevel] = useState("A1"); // Standardniveau

  const handleDrop = async (event) => {
    event.preventDefault();
    const text = event.dataTransfer.getData("text");

    // Analysiere den Text und extrahiere Präpositionen
    const { simple, compound, special } = await analyzeText(text);

    // Hilfsfunktion zum Hinzufügen oder Aktualisieren eines Worts in der Kategorie
    const updateCategory = (categoryName, words) => {
      setToReview((prev) => {
        const updatedCategory = { ...prev[categoryName] };

        words.forEach((word) => {
          if (updatedCategory[word]) {
            updatedCategory[word] += 1; // Zähler erhöhen
          } else {
            updatedCategory[word] = 1; // Neues Wort hinzufügen
          }
        });

        return {
          ...prev,
          [categoryName]: updatedCategory,
        };
      });
    };

    // Aktualisiere die Kategorien
    if (simple.length > 0) {
      updateCategory("Einfache Präpositionen", simple);
    }

    if (compound.length > 0) {
      updateCategory("Zusammengesetzte Präpositionen", compound);
    }

    if (special.length > 0) {
      updateCategory("Spezielle Präpositionen", special);
    }

    // Aktualisiere die Zähler für die Kategorien
    setCategoryCounts((prev) => ({
      ...prev,
      "Einfache Präpositionen": (prev["Einfache Präpositionen"] || 0) + simple.length,
      "Zusammengesetzte Präpositionen": (prev["Zusammengesetzte Präpositionen"] || 0) + compound.length,
      "Spezielle Präpositionen": (prev["Spezielle Präpositionen"] || 0) + special.length,
    }));
  };

  const analyzeText = async (text) => {
    // Entferne Anführungszeichen aus dem Text
    const cleanedText = text.replace(/['"]+/g, ""); // Entfernt einfache und doppelte Anführungszeichen

    // Kategorien von Präpositionen
    const simplePrepositions = ["di", "da", "a", "in", "su", "per", "con", "tra", "fra"];
    const compoundPrepositions = ["del", "al", "dal", "nel", "sul"];
    const specialPrepositions = ["verso", "oltre", "sotto", "sopra", "dietro", "davanti", "nonostante", "malgrado", "durante", "fino a", "attraverso", "gegen"];

    // Zerlege den Text in Wörter
    const words = cleanedText.toLowerCase().split(/\s+/); // Konvertiere in Kleinbuchstaben und trenne nach Leerzeichen

    // Extrahiere Präpositionen aus jeder Kategorie
    const extractedSimple = words.filter((word) => simplePrepositions.includes(word));
    const extractedCompound = words.filter((word) => compoundPrepositions.includes(word));
    const extractedSpecial = words.filter((word) => specialPrepositions.includes(word));

    // Rückgabe: Nur die gefundenen Präpositionen, gruppiert nach Kategorie
    return {
      simple: extractedSimple,
      compound: extractedCompound,
      special: extractedSpecial,
    };
  };

  const handleDragStart = (e, text) => {
    // Prüfe, ob ein Text markiert wurde
    const selection = window.getSelection().toString();
    if (selection) {
      e.dataTransfer.setData("text", selection); // Nur den markierten Text übertragen
    } else {
      e.dataTransfer.setData("text", text); // Fallback: Gesamten Text übertragen
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Überschrift und Dropdown */}
      <div className="flex items-center gap-4 mb-8">
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
          <div className="chat-history mb-4 max-h-64 overflow-y-auto border border-gray-300 rounded p-3">
            <h2 className="text-xl font-bold mb-4">Chat-Historie</h2>
            {chat.map((entry, index) => (
              <div key={index} className="mb-2">
                {/* Benutzer-Eingabe */}
                <p
                  className="text-blue-600 font-semibold"
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, entry.user)}
                >
                  Benutzer: {entry.user}
                </p>
                {/* KI-Antwort */}
                <p
                  className="text-green-600"
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, entry.response)}
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
              : "Buongiorno! Benvenuto nel mondo della lingua italiana!"}
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
            Sie können zu vertiefende Texte aus der Chat-Historie hier per Drag-and-Drop hineinziehen. Das geht
            indem sie entweder einzelne Stelle markieren oder den gesamten Text. Die App analysiert den Text für sie.
          </p>
          {Object.keys(toReview).map((category) => (
            <div key={category} className="mb-4">
              <h3 className="text-xl font-semibold">{category}</h3>
              <ul className="list-disc pl-6">
                {Object.entries(toReview[category]).map(([word, count]) => (
                  <li key={word}>
                    {word} ({count}x)
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}