console.log("✅ widget.js cargado correctamente");

// Crear botón flotante
const chatButton = document.createElement("button");
chatButton.innerText = "💬";
chatButton.style.position = "fixed";
chatButton.style.bottom = "20px";
chatButton.style.right = "20px";
chatButton.style.width = "60px";
chatButton.style.height = "60px";
chatButton.style.borderRadius = "50%";
chatButton.style.border = "none";
chatButton.style.background = "#007bff";
chatButton.style.color = "#fff";
chatButton.style.fontSize = "24px";
chatButton.style.cursor = "pointer";
chatButton.style.boxShadow = "0 4px 6px rgba(0,0,0,0.2)";
document.body.appendChild(chatButton);

// Crear contenedor del chat (inicialmente oculto)
const chatContainer = document.createElement("div");
chatContainer.style.position = "fixed";
chatContainer.style.bottom = "90px";
chatContainer.style.right = "20px";
chatContainer.style.width = "300px";
chatContainer.style.height = "400px";
chatContainer.style.background = "#fff";
chatContainer.style.border = "1px solid #ccc";
chatContainer.style.borderRadius = "10px";
chatContainer.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
chatContainer.style.display = "none"; // oculto al inicio
chatContainer.style.flexDirection = "column";
chatContainer.style.overflow = "hidden";
document.body.appendChild(chatContainer);

// Área de mensajes
const messagesArea = document.createElement("div");
messagesArea.style.flex = "1";
messagesArea.style.padding = "10px";
messagesArea.style.overflowY = "auto";
messagesArea.style.fontFamily = "Arial, sans-serif";
chatContainer.appendChild(messagesArea);

// Input + botón enviar
const inputContainer = document.createElement("div");
inputContainer.style.display = "flex";
inputContainer.style.borderTop = "1px solid #ddd";
chatContainer.appendChild(inputContainer);

const input = document.createElement("input");
input.type = "text";
input.placeholder = "Escribe un mensaje...";
input.style.flex = "1";
input.style.border = "none";
input.style.padding = "10px";
input.style.fontSize = "14px";
inputContainer.appendChild(input);

const sendButton = document.createElement("button");
sendButton.innerText = "➤";
sendButton.style.border = "none";
sendButton.style.background = "#007bff";
sendButton.style.color = "#fff";
sendButton.style.padding = "10px 15px";
sendButton.style.cursor = "pointer";
inputContainer.appendChild(sendButton);

// Toggle abrir/cerrar
chatButton.addEventListener("click", () => {
  chatContainer.style.display =
    chatContainer.style.display === "none" ? "flex" : "none";
});

// Función para agregar mensajes al chat
function addMessage(text, sender = "user") {
  const msg = document.createElement("div");
  msg.innerText = text;
  msg.style.margin = "5px 0";
  msg.style.padding = "8px 12px";
  msg.style.borderRadius = "8px";
  msg.style.maxWidth = "80%";
  msg.style.wordWrap = "break-word";

  if (sender === "user") {
    msg.style.alignSelf = "flex-end";
    msg.style.background = "#007bff";
    msg.style.color = "#fff";
  } else {
    msg.style.alignSelf = "flex-start";
    msg.style.background = "#f1f1f1";
    msg.style.color = "#333";
  }

  messagesArea.appendChild(msg);
  messagesArea.scrollTop = messagesArea.scrollHeight; // auto scroll
}

// Enviar mensaje
sendButton.addEventListener("click", async () => {
  if (!input.value.trim()) return;
  const userText = input.value.trim();
  addMessage(userText, "user");
  input.value = "";

  // Mostrar mensaje de "escribiendo..."
  const loadingMsg = document.createElement("div");
  loadingMsg.innerText = "🤖 escribiendo...";
  loadingMsg.style.alignSelf = "flex-start";
  loadingMsg.style.fontStyle = "italic";
  messagesArea.appendChild(loadingMsg);
  messagesArea.scrollTop = messagesArea.scrollHeight;

  try {
    // 🚀 Aquí llamamos tu backend en Vercel
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userMessage: userText,
        sessionId: "web-" + Date.now(), // id simple por ahora
      }),
    });

    const data = await res.json();
    loadingMsg.remove(); // quitar "escribiendo..."

    if (data.reply) {
      addMessage(data.reply, "bot");
    } else {
      addMessage("⚠️ Error en la respuesta del servidor", "bot");
      console.error("Error API:", data);
    }
  } catch (error) {
    loadingMsg.remove();
    addMessage("❌ No se pudo conectar con el servidor", "bot");
    console.error("Fetch error:", error);
  }
});
