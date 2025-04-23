"use client";
import { useState } from "react";

export default function HomePage() {
  const [currentWorld, setCurrentWorld] = useState("cafe");
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Sprachwelt</h1>

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

      <div className="w-full max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
        <p className="text-lg mb-4">
          🧠 KI-Barista:{" "}
          {chat.length > 0
            ? chat[chat.length - 1].response
            : "Buongiorno! Cosa desidera?"}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!input) return;

            setChat([...chat, { user: input, response: "..." }]);
            setInput("");

            // Simulierte KI-Antwort
            //setTimeout(() => {
            //  const antwort = `Hmm… "${input}"? Mi sembra delizioso! 🍰`;
            //  setChat((prev) => [
            //    ...prev.slice(0, -1),
            //</div>    { user: input, response: antwort },
            //  ]);
            //}, 1000);

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
    </main>
  );
}
