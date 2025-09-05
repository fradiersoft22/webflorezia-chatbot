// /api/chat.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // en Vercel > Settings > Environment Variables
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userMessage, sessionId } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: "Falta userMessage en el body" });
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
         {
  role: "system",
  content: "Eres el asistente virtual de WebFlorezia. Tu tarea es conversar de forma clara, profesional y amigable para captar leads. El flujo de la conversación debe ser breve: 1) Primero saluda y pide el nombre del cliente. 2) Luego pregunta qué servicio busca (ej: página web, tienda online, SEO, software a medida). 3) Responde siempre de manera cordial, sin dar código ni explicaciones técnicas. 4) Cuando el cliente diga qué quiere, confirma su nombre y el servicio, y finaliza con un mensaje como: '¡Perfecto [nombre]! 🚀 Tomo nota de tu interés en [servicio]. En un momento te escribiré de nuevo para enviarte una cotización personalizada. Gracias por confiar en WebFlorezia ✨'. Nunca des respuestas demasiado largas ni técnicas. Tu objetivo es sonar como un asesor comercial que vende software y páginas web, no como un programador.",
  
            role: "user",
            content: userMessage,
          },
        ],
      });

      const reply = completion.choices[0].message.content;

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
