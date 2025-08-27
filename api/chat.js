// /api/chat.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userMessage, sessionId } = req.body;

    // Validación básica
    if (!userMessage) {
      return res.status(400).json({ error: "Falta userMessage en el body" });
    }

    return res.status(200).json({
      reply: `Hola! Recibí: ${userMessage}`,
      session: sessionId || null
    });
  } else {
    return res.status(405).json({ error: "Método no permitido" });
  }
}
