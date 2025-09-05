console.log("✅ Widget cargado desde Vercel");

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("chat-widget");

  if (!container) {
    console.error("❌ No encontré el contenedor #chat-widget");
    return;
  }

  container.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 300px;
      height: 400px;
      border: 1px solid #ccc;
      border-radius: 10px;
      background: white;
      display: flex;
      flex-direction: column;
    ">
      <div style="background:#333;color:white;padding:10px;border-radius:10px 10px 0 0;">
        Chat WebFlorezia
      </div>
      <div id="chat-messages" style="flex:1; padding:10px; overflow-y:auto; font-size:14px;"></div>
      <div style="display:flex; border-top:1px solid #ccc;">
        <input id="chat-input" type="text" placeholder="Escribe..." style="flex:1; border:none; padding:10px;"/>
        <button id="chat-send" style="padding:10px; background:#333; color:white; border:none;">➤</button>
      </div>
    </div>
  `;

  const input = document.getElementById("chat-input");
  const send = document.getElementById("chat-send");
  const messages = document.getElementById("chat-messages");

  send.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;
    messages.innerHTML += `<div><b>Tú:</b> ${text}</div>`;
    input.value = "";
  });
});
