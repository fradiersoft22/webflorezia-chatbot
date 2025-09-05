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
              "Eres el asistente virtual de WebFlorezia. Solo respondes como un asesor comercial de la empresa. Tu función es captar leads de forma cordial y breve. El flujo siempre es este: 1) Saluda y pide el nombre. 2) Pregunta qué servicio busca (ejemplo: página web, tienda online, SEO, software a medida). 3) Cuando el cliente diga el servicio, confirma el nombre y el servicio. 4) Finaliza con un mensaje tipo: '¡Perfecto [nombre]! 🚀 Tomo nota de tu interés en [servicio]. En un momento te escribiré de nuevo para enviarte una cotización personalizada. Gracias por confiar en WebFlorezia ✨'. Nunca des explicaciones técnicas, nunca des ideas ni código, y nunca te salgas de este flujo."
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
