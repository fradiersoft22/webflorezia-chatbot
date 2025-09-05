const chatContainer = document.getElementById("chat-widget");
chatContainer.innerHTML = `
  <div style="border:1px solid #ccc; padding:10px; width:300px; font-family: Arial, sans-serif;">
    <div id="messages" style="height:200px; overflow-y:auto; border:1px solid #ddd; margin-bottom:10px; padding:5px;"></div>
    <input id="userInput" type="text" placeholder="Escribe tu mensaje..." style="width:75%; padding:5px;">
    <button id="sendBtn" style="width:20%; padding:5px;">Enviar</button>
  </div>
`;

const messagesDiv = document.getElementById("messages");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

function addMessage(sender, text) {
  const msg = document.createElement("p");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

sendBtn.addEventListener("click", async () => {
  const userMessage = input.value.trim();
  if (!userMessage) return;

  addMessage("Tú", userMessage);
  input.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userMessage }),
    });

    const data = await res.json();

    if (data.reply) {
      addMessage("WebFlorezia Bot", data.reply);
    } else {
      addMessage("Error", "No hubo respuesta del bot.");
    }
  } catch (err) {
    addMessage("Error", "No se pudo conectar con el servidor.");
  }
});
