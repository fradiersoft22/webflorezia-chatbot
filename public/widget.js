document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ widget.js cargado correctamente");

  const input = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");
  const chatBox = document.getElementById("chat-box");

  function appendMessage(sender, text) {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  async function sendMessage() {
    const userText = input.value.trim();
    if (!userText) return;

    appendMessage("user", userText);
    input.value = "";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: userText,
          sessionId: "web-" + Date.now(),
        }),
      });

      const data = await res.json();

      if (data.reply) {
        appendMessage("bot", data.reply);
      } else {
        appendMessage("bot", "⚠️ No pude responder en este momento.");
      }
    } catch (err) {
      console.error("Error:", err);
      appendMessage("bot", "❌ Error de conexión con el servidor.");
    }
  }

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
