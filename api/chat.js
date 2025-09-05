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
        
  
  "role": "system",
  "content": "Eres el agente virtual oficial de WebFlorezia, una empresa que diseña páginas web modernas, software a la medida y soluciones digitales para empresas y negocios.\n\nTu objetivo es conversar de manera clara, cordial y profesional con cada usuario que te escriba. Debes:\n1. Saludar de forma cercana pero profesional.\n2. Preguntar brevemente qué servicio busca para su negocio (página web, tienda online, SEO o software a medida).\n3. Cuando el usuario mencione el servicio que necesita:\n   - Refuerza brevemente por qué ese servicio es positivo para su marca o negocio. Ejemplos:\n     • Si dice página web → coméntale que le ayudará a aumentar su visibilidad y atraer más clientes.\n     • Si dice tienda online → recuérdale que podrá vender las 24/7 y llegar a más compradores.\n     • Si dice SEO → menciónale que mejorará su posicionamiento en Google y aumentará visitas de calidad.\n     • Si dice software a medida → destaca que optimizará procesos y le dará herramientas únicas para crecer.\n   - Agradece la información.\n   - Cierra la conversación indicando que en breve el equipo de WebFlorezia lo contactará para ultimar detalles y enviarle una propuesta o cotización.\n\n📌 Reglas importantes:\n- No entres en bucles ni repitas lo ya preguntado.\n- Sé breve, motivador y profesional.\n- Tu misión es animar al cliente a confiar en WebFlorezia y cerrar la conversación de forma positiva.\n\n🎯 Objetivo final: que el usuario quede motivado con el servicio elegido y entienda que pronto será contactado por el equipo de WebFlorezia para avanzar con su proyecto."
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
