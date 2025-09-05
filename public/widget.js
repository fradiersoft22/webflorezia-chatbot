// /public/widget.js
const API_URL = "/api/chat"; // ajusta si cambias el path en Vercel

function createWidget() {
  // Botón flotante
  const button = document.createElement("button");
  button.innerText = "💬 Chat";
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.padding = "10px 15px";
  button.style.borderRadius = "50%";
  button.style.background = "#2563eb"; // azul
  button.style.color = "white";
  button.style.border = "none";
  button.style.cursor = "pointer";
  button.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
  document.body.appendChild(button);

  // Panel de chat
  const chatBox = document.createElement("div");
  chatBox.style.position = "fixed";
  chatBox.style.bottom = "70px";
  chatBox.style.right = "20px";
  chatBox.style.width = "300px";
  chatBox.style.height = "400px";
  chatBox.style.background = "white";
  chatBox.style.border = "1px solid #ccc";
  chatBox.style.borderRadius = "10px";
  chatBox.style.display = "none";
  chatBox.style.flexDirection = "column";
  chatBox.style.overflow = "hidden";
  document.body.appendChild(chatBox);

  const messages = document.createElement("div");
  messages.style.flex = "1";
  messages.style.padding = "10px";
  messages.style.overflowY = "auto";
  chatBox.appendChild(messages);

  const inputWrapper = document.createElement("div");
  inputWrapper.style.display = "flex";
  inputWrapper.style.borderTop = "1px solid #ddd";
  chatBox.appendChild(inputWrapper);

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Escribe un mensaje...";
  input.style.flex = "1";
  input.style.border = "none";
  input.style.padding = "10px";
  inputWrapper.appendChild(input);

  const sendBtn = document.createElement("button");
  sendBtn.innerText = "➤";
  sendBtn.style.border = "none";
  sendBtn.style.background = "#2563eb";
  sendBtn.style.color = "white";
  sendBtn.style.padding = "10px 15px";
  inputWrapper.appendChild(sendBtn);

  // Mostrar/ocultar chat
  button.addEventListener("click", () => {
    chatBox.style.display = chatBox.style.display === "none" ? "flex" : "none";
  });

  // Enviar mensajes
  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    // Mostrar mensaje del usuario
    const userMsg = document.createElement("div");
    userMsg.innerText = "Tú: " + text;
    userMsg.style.margin = "5px 0";
    userMsg.style.textAlign = "right";
    messages.appendChild(userMsg);

    input.value = "";

    // Llamar a backend
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: text, sessionId: "test" }),
      });

      const data = await res.json();

      // Mostrar respuesta del bot
      const botMsg = document.createElement("div");
      botMsg.innerText = "Bot: " + (data.reply || "Error de respuesta");
      botMsg.style.margin = "5px 0";
      botMsg.style.textAlign = "left";
      messages.appendChild(botMsg);

      messages.scrollTop = messages.scrollHeight;
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
    }
  }

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
}

// Iniciar widget
window.addEventListener("DOMContentLoaded", createWidget);
