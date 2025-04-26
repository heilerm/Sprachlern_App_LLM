"use client";
import { useState } from "react";
import DropZoneWithFeatures from "./components/DropZoneWithFeatures";
import SentenceStructure from "./components/SentenceStructure";
import { useRef, useEffect } from "react";

export default function HomePage() {
  const [currentWorld, setCurrentWorld] = useState("cafe");
  const worldLabels = {
    cafe: "Café",
    hotel: "Hotel",
    markt: "Markt"
  };
  
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("A1");
  const chatHistoryRef = useRef(null);

  const handleDragStart = (e, text) => {
    const selection = window.getSelection().toString();
    if (selection) {
      e.dataTransfer.setData("text", selection);
    } else {
      e.dataTransfer.setData("text", text);
    }
  };
// Effekt hinzufügen:
useEffect(() => {
  if (chatHistoryRef.current) {
    chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
  }
}, [chat]);


  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
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
        {/* NEU: Welten-Auswahl */}
        <select
          className="border border-gray-300 rounded px-3 py-2"
          value={currentWorld}
          onChange={(e) => setCurrentWorld(e.target.value)}
        >
          {Object.entries(worldLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

      </div>

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

      <div className="flex gap-6">
        <div className="flex-1 bg-white p-6 rounded-xl shadow">
          <div ref={chatHistoryRef} className="chat-history mb-4 max-h-64 overflow-y-auto border border-gray-300 rounded p-3">
            <h2 className="text-xl font-bold mb-4">Chat-Historie</h2>
            {chat.map((entry, index) => (
              <div key={index} className="mb-2">
                <p
                  className="text-blue-600 font-semibold"
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, entry.user)}
                >
                  Benutzer: {entry.user}
                </p>
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

          <p className="text-lg mb-4">
            🧠 KI-Barista: {chat.length > 0 ? chat[chat.length - 1].response : "Buongiorno! Benvenuto nel mondo della lingua italiana!"}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!input) return;

              setChat([...chat, { user: input, response: "..." }]);
              setInput("");

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

        <div className="w-[600px]">
          <DropZoneWithFeatures level={selectedLevel} world={currentWorld} />
        </div>
      </div>
    </main>
  );
}
