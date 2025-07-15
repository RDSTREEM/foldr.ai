// modal.js
export function createModal() {
  const overlay = document.createElement("div");
  overlay.id = "foldrai-modal-overlay";
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(52, 53, 65, 0.7); z-index: 9999; display: none; align-items: center; justify-content: center;`;
  overlay.innerHTML = `
    <div id="foldrai-modal" style="background: #202123; color: #ececf1; border-radius: 10px; box-shadow: 0 2px 16px #0008; padding: 32px 28px; min-width: 320px; max-width: 90vw;">
      <h2 id="foldrai-modal-title" style="font-size: 18px; font-weight: 600; margin-bottom: 18px; letter-spacing: 0.01em;"></h2>
      <div id="foldrai-modal-content" style="margin-bottom: 18px;"></div>
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button id="foldrai-modal-confirm" style="background: #19c37d; color: #fff; border: none; border-radius: 6px; font-size: 14px; font-weight: 500; padding: 7px 18px; cursor: pointer;">Confirm</button>
        <button id="foldrai-modal-cancel" class="cancel-btn" style="background: #343541; color: #ececf1; border: 1px solid #444654; border-radius: 6px; font-size: 14px; font-weight: 500; padding: 7px 18px; cursor: pointer;">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById("foldrai-modal-cancel").onclick = () => {
    overlay.style.display = "none";
  };
}

export function showModal({ title, contentHTML, onConfirm }) {
  const overlay = document.getElementById("foldrai-modal-overlay");
  const titleEl = document.getElementById("foldrai-modal-title");
  const contentEl = document.getElementById("foldrai-modal-content");
  const confirmBtn = document.getElementById("foldrai-modal-confirm");

  titleEl.textContent = title;
  contentEl.innerHTML = contentHTML;

  confirmBtn.onclick = () => {
    onConfirm();
    overlay.style.display = "none";
  };

  overlay.style.display = "flex";
}
