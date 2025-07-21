// modal.js
export function createModal() {
  const modalOverlay = document.createElement("div");
  modalOverlay.id = "foldrai-modal-overlay";
  modalOverlay.className = "foldrai-modal-overlay";
  modalOverlay.innerHTML = `
    <div id="foldrai-modal" class="foldrai-modal">
      <h2 id="foldrai-modal-title" class="foldrai-modal-title"></h2>
      <div id="foldrai-modal-content" class="foldrai-modal-content"></div>
      <div class="foldrai-modal-actions">
        <button id="foldrai-modal-confirm" class="foldrai-modal-confirm">Confirm</button>
        <button id="foldrai-modal-cancel" class="foldrai-modal-cancel">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modalOverlay);

  document.getElementById("foldrai-modal-cancel").onclick = () => {
    modalOverlay.classList.remove("visible");
  };
}

export function showModal({ title, contentHTML, onConfirm }) {
  const modalOverlay = document.getElementById("foldrai-modal-overlay");
  const modalTitle = document.getElementById("foldrai-modal-title");
  const modalContent = document.getElementById("foldrai-modal-content");
  const modalConfirmBtn = document.getElementById("foldrai-modal-confirm");

  modalTitle.textContent = title;
  modalContent.innerHTML = contentHTML;

  modalConfirmBtn.onclick = () => {
    onConfirm();
    modalOverlay.classList.remove("visible");
  };

  modalOverlay.classList.add("visible");
}
