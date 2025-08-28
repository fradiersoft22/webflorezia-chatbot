// /api/chat.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // la guardas en Vercel > Settings > Environment Variables
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userMessage, sessionId } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: "Falta userMessage en el body" });
    }

    try {
      // Llamada al modelo
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // rápido y barato
        messages: [
          {
            role: "system",
            content: "Eres el asistente de WebFlorezia. Responde claro y profesional. Tu objetivo es captar leads (nombre, WhatsApp/email, servicio, urgencia).",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      });

      const reply = completion.choices[0].message.content;

      // Respuesta al frontend
      return res.status(200).json({
        reply,
        session: sessionId || null,
      });
    } catch (error) {
      console.error("Error con OpenAI:", error);
      return res.status(500).json({ error: "Error al conectar con OpenAI" });
    }
  } else {
    return res.status(405).json({ error: "Método no permitido" });
  }
}
