import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { userMessage, sessionId } = req.body;

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Eres un asistente útil para Web Florezia." },
        { role: "user", content: userMessage }
      ]
    });

    const reply = completion.choices[0].message.content;

    // TODO: aquí luego conectamos con Google Sheets

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Error en el endpoint:", err);
    res.status(500).json({ error: "Algo salió mal" });
  }
}
