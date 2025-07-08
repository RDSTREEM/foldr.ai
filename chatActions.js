// chatActions.js
import { showModal } from "./modal.js";
import { renderFolders } from "./sidebar.js";

export function injectAddButtonInChatPage() {
  if (!window.location.pathname.startsWith("/c/")) return;

  const check = setInterval(() => {
    const shareBtn = document.querySelector('button[aria-label="Share"]');
    if (!shareBtn || document.getElementById("foldrai-chat-btn")) return;

    const container = shareBtn.parentNode;
    const addBtn = document.createElement("button");
    addBtn.id = "foldrai-chat-btn";
    addBtn.textContent = "➕ Add to Folder";
    addBtn.style.cssText = `
      background: none;
      border: 1px solid #4caf50;
      color: #4caf50;
      font-size: 13px;
      padding: 4px 6px;
      margin-right: 4px;
      border-radius: 4px;
      cursor: pointer;
    `;

    addBtn.onclick = () => {
      chrome.storage.local.get(["folders"], (data) => {
        const folders = data.folders || [];
        if (folders.length === 0) {
          alert("No folders yet. Create one in the sidebar first.");
          return;
        }

        const options = folders
          .map((f, i) => `<option value="${i}">${f.name}</option>`)
          .join("");
        showModal({
          title: "Add This Chat to Folder",
          contentHTML: `<select id=\"foldr-folder-select\">${options}</select>`,
          onConfirm: () => {
            const index = document.getElementById("foldr-folder-select").value;
            const title = document.title.replace(" - ChatGPT", "").trim();
            const url = window.location.href;

            if (!folders[index].chats.some((c) => c.url === url)) {
              folders[index].chats.push({ title, url, pinned: false });
              chrome.storage.local.set({ folders }, renderFolders);
            } else {
              alert("Already in that folder!");
            }
          },
        });
      });
    };

    container.insertBefore(addBtn, shareBtn);
    clearInterval(check);
  }, 500);
}
