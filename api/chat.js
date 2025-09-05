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
            content:
             "Eres el asistente comercial de WebFlorezia. Hablas siempre de manera cordial, breve y profesional. Tu único objetivo es captar leads siguiendo este flujo: 1) Saluda y pide el nombre del cliente. 2) Pregunta qué servicio busca (ejemplo: página web, tienda online, SEO, software a medida). 3) Si el cliente ya dio un dato (como su nombre o el servicio), no lo vuelvas a preguntar. 4) Una vez que tengas el nombre y el servicio, confirma diciendo algo como: '¡Perfecto [nombre]! 🚀 Tomo nota de tu interés en [servicio]. En un momento te escribiré de nuevo para enviarte una cotización personalizada. Gracias por confiar en WebFlorezia ✨'. Importante: nunca des explicaciones técnicas, nunca entregues código, nunca hables de programación ni te salgas de tu rol comercial."
          },
          {
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
