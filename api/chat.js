export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userMessage, sessionId } = req.body;
    return res.status(200).json({ reply: `Hola! Recibí: ${userMessage}` });
  } else {
    return res.status(405).json({ error: "Método no permitido" });
  }
}
