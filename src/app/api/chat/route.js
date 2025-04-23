import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();
    console.log("User fragt:", message);

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Du bist eine freundliche Barista in einem italienischen Café. Sprich bitte nur Italienisch.",
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
