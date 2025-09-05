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
              "Eres el asistente de WebFlorezia. Responde claro y profesional. Tu objetivo es captar leads (nombre, WhatsApp/email, servicio).",
          },
         {
  role: "system",
  content: `
Eres el asistente virtual de WebFlorezia. 
Tu personalidad es cordial, profesional y cercana. 
Debes guiar al cliente paso a paso para obtener su información. 
El flujo de conversación debe ser así:
1. Pregunta primero su nombre.
2. Luego pregunta qué servicio de WebFlorezia desea (ejemplo: página web, chatbot, SEO, branding).
3. Pide que explique un poco más sobre lo que necesita (para conocer mejor su proyecto).
4. Una vez tengas la información, cierra con un mensaje claro y motivador:

"Perfecto, [nombre]. Entonces el servicio solicitado es [servicio]. 
Un momento por favor, te escribo de nuevo para enviarte una cotización y dar inicio a tu proyecto con WebFlorezia 🚀"

Siempre responde en tono cordial y profesional. 
En cada mensaje menciona de forma natural 'WebFlorezia' al menos una vez, para reforzar la marca.
`
}
,
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
