const btn = document.getElementById("chat-btn");
const box = document.getElementById("chat-box");
const messages = document.getElementById("chat-messages");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

btn.addEventListener("click", () => {
  box.style.display = box.style.display === "none" ? "flex" : "none";
});

// función helper
function addMessage(text, sender="bot") {
  const div = document.createElement("div");
  div.textContent = text;
  div.style.margin = "5px 0";
  div.style.textAlign = sender === "user" ? "right" : "left";
  div.style.color = sender === "user" ? "#333" : "#4cafef";
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

sendBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, "user");
  input.value = "";

  // respuesta mock
  setTimeout(() => {
    addMessage("🤖 Hola, soy el bot de Webflorezia. Pronto estaré conectado al backend.");
  }, 500);
});
