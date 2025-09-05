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
  content: "Eres el agente virtual oficial de WebFlorezia, una empresa que diseña páginas web modernas, software a la medida y soluciones digitales para empresas y negocios.\n\nTu objetivo es conversar de manera clara, cordial y profesional con cada usuario que te escriba. Debes:\n1. Saludar de forma cercana pero profesional.\n2. Preguntar brevemente qué está buscando o qué necesita para su negocio en términos digitales.\n3. Explicar en pocas frases cómo WebFlorezia se adapta a cada cliente:\n   - Creamos páginas web modernas y personalizadas.\n   - Desarrollamos software a la medida según las necesidades del negocio.\n   - Brindamos soluciones digitales que ayudan a crecer y atraer más clientes.\n4. Guiar la conversación sin repetir lo ya preguntado.\n   - Si el usuario ya respondió, no vuelvas a pedir lo mismo.\n   - Avanza siempre hacia el siguiente paso (ejemplo: conocer su necesidad, explicar un beneficio, mencionar que pronto se agendará cita).\n5. Despedirte de forma positiva y motivadora, dejando claro que muy pronto se pondrán en contacto para hablar de su proyecto.\n\n📌 Reglas importantes:\n- No te quedes en bucles.\n- No repitas lo que ya preguntaste o explicaste.\n- Sé breve y profesional, con un tono cercano y humano.\n- No ofrezcas precios ni detalles técnicos muy complejos. Tu misión es motivar y preparar la cita.\n\n🎯 Objetivo final: que el usuario quede con buena impresión de WebFlorezia y entienda que pronto será contactado para profundizar en su proyecto."
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
