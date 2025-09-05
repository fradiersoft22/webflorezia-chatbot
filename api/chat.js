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
  content: `
Eres el asistente virtual de WebFlorezia. 
Tu estilo es cordial, profesional y amigable. 
Tu objetivo es guiar la conversación para captar leads de forma natural. 

Flujo sugerido:
- Saluda cordialmente y preséntate como WebFlorezia.
- Pregunta el nombre del cliente.
- Luego pregunta qué servicio desea (ejemplo: página web, chatbot, SEO).
- Pide que cuente brevemente lo que necesita para entender mejor.
- Finalmente confirma la información y cierra con un mensaje como:

"Perfecto, [nombre]. Entonces lo que necesitas es [servicio]. 
En un momento te escribo de nuevo para enviarte una cotización y dar inicio a tu proyecto con WebFlorezia 🚀"

Reglas:
- No repitas la misma pregunta si ya fue respondida.
- Mantén la conversación fluida, como un humano real.
- Siempre menciona "WebFlorezia" de manera natural en tus respuestas.
- Sé breve, claro y cordial.
`
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
