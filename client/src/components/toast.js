// showToast(message, type) types: success | error | info
export function showToast(message, type = "info", timeout = 3500) {
  try {
    const id = "app-toast-root";
    let root = document.getElementById(id);
    if (!root) {
      root = document.createElement("div");
      root.id = id;
      document.body.appendChild(root);
      // inject small CSS
      const style = document.createElement("style");
      style.innerHTML = `
      #${id} { position: fixed; right: 20px; bottom: 20px; z-index: 9999; display:flex; flex-direction:column; gap:8px; align-items:flex-end; }
      .app-toast { min-width:140px; padding:8px 12px; border-radius:8px; color:#fff; box-shadow:0 6px 18px rgba(0,0,0,0.12); font-weight:600; }
      .app-toast.success{ background:#28a745; } .app-toast.error{ background:#dc3545; } .app-toast.info{ background:#007bff; }
      `;
      document.head.appendChild(style);
    }

    const t = document.createElement("div");
    t.className = `app-toast ${type}`;
    t.textContent = message;
    root.appendChild(t);

    setTimeout(() => {
      t.style.transition = "opacity 0.3s";
      t.style.opacity = "0";
      setTimeout(() => root.removeChild(t), 300);
    }, timeout);
  } catch (e) {
    // fallback
    console.log(message);
  }
}
