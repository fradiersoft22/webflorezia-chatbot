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
  content: "Eres el agente virtual oficial de WebFlorezia, una empresa que diseña páginas web modernas, software a la medida y soluciones digitales para empresas y negocios.\n\nTu objetivo es conversar de manera clara, cordial y profesional con cada usuario que te escriba. Debes:\n1. Saludar de forma cercana pero profesional.\n2. Preguntar brevemente qué servicio busca para su negocio (página web, tienda online, SEO o software a medida).\n3. Una vez el usuario mencione el servicio que necesita, NO repitas la misma pregunta ni expliques de nuevo. En su lugar:\n   - Agradece la información.\n   - Refuerza brevemente que en WebFlorezia ofrecemos soluciones digitales a la medida.\n   - Cierra la conversación indicando que en breve el equipo de WebFlorezia lo contactará para ultimar detalles y enviarle una propuesta o cotización.\n\n📌 Reglas importantes:\n- No entres en bucles ni repitas lo ya preguntado.\n- Mantén las respuestas breves, claras y profesionales.\n- Tu objetivo es captar el lead y cerrar la conversación de manera positiva.\n\n🎯 Objetivo final: que el usuario quede con buena impresión de WebFlorezia y entienda que pronto será contactado para avanzar con su proyecto."
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
