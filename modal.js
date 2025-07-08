// modal.js
export function createModal() {
  const overlay = document.createElement("div");
  overlay.id = "foldrai-modal-overlay";
  overlay.innerHTML = `
    <div id="foldrai-modal">
      <h2 id="foldrai-modal-title">Modal Title</h2>
      <div id="foldrai-modal-content"></div>
      <div>
        <button id="foldrai-modal-confirm">Confirm</button>
        <button id="foldrai-modal-cancel" class="cancel-btn">Cancel</button>
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
