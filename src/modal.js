// =============================
// Modal Utilities
// =============================

/**
 * Creates and appends the modal overlay and modal box to the document body.
 * Ensures cancel button closes the modal.
 */
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

  const cancelBtn = document.getElementById("foldrai-modal-cancel");
  if (cancelBtn) {
    cancelBtn.onclick = () => {
      modalOverlay.classList.remove("visible");
    };
  }
}

/**
 * Shows the modal with given title, content, and confirm callback.
 * Checks for missing DOM elements before accessing.
 * @param {Object} options
 * @param {string} options.title - Modal title
 * @param {string} options.contentHTML - Modal content HTML
 * @param {Function} options.onConfirm - Confirm callback
 */
export function showModal({ title, contentHTML, onConfirm }) {
  const modalOverlay = document.getElementById("foldrai-modal-overlay");
  const modalTitle = document.getElementById("foldrai-modal-title");
  const modalContent = document.getElementById("foldrai-modal-content");
  const modalConfirmBtn = document.getElementById("foldrai-modal-confirm");

  if (!modalOverlay || !modalTitle || !modalContent || !modalConfirmBtn) {
    console.error("Modal elements not found. Did you call createModal()?");
    return;
  }

  modalTitle.textContent = title;
  modalContent.innerHTML = contentHTML;

  modalConfirmBtn.onclick = () => {
    if (typeof onConfirm === "function") onConfirm();
    modalOverlay.classList.remove("visible");
  };

  modalOverlay.classList.add("visible");
}
