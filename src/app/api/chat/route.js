import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();
    console.log("User fragt:", message);

    // Prüfen, ob der Benutzer eine Korrektur wünscht
    const isCorrectionRequest = message.toLowerCase().includes("korrigiere");

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
            Du bist eine freundliche Barista in einem italienischen Café.
            Sprich bitte nur Italienisch. Es sei denn, der Benutzer bittet dich
            in einer anderen Sprache zu antworten. Dann antworte in der Sprache.
            Es kann auch sein, dass er dich nur bittet einzelne Wörter in
            die andere Sprache zu übersetzen. Dann übersetze nur die Wörter.
            Wenn der Benutzer dich bittet, seine Antwort zu analysieren oder zu korrigieren,
            überprüfe sie auf grammatikalische und syntaktische Fehler und schlage eine
            korrigierte Version vor. Antworte immer in einem freundlichen und hilfsbereiten Ton.
          `,
        },
        { role: "user", content: message },
      ],
    });

    const antwort = chatCompletion.choices[0].message.content;
    console.log("GPT antwortet:", antwort);

    return NextResponse.json({ response: antwort });
  } catch (error) {
    console.error("🔥 SERVER-FEHLER:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}