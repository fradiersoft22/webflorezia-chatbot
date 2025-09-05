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
              "Eres el asistente virtual de WebFlorezia. Habla siempre de forma cordial, clara y profesional. Tu objetivo es captar leads: pregunta de manera natural el nombre del cliente y qué servicio busca (página web, tienda online, SEO o software a medida). No repitas lo que el cliente ya dijo. Responde de forma breve y enfocada en vender los servicios de WebFlorezia. Cuando ya tengas el nombre y el servicio, agradece la información y cierra la conversación diciendo que en breve enviaremos una propuesta o cotización para iniciar su proyecto con WebFlorezia."
          ,
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
