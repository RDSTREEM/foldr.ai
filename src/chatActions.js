// Initializes navigation detection and injects Add to Folder button on chat page navigation
export function initChatButtonNavigation() {
  let lastPathname = window.location.pathname;
  function handleChatPage() {
    if (window.location.pathname.startsWith("/c/")) {
      if (!document.getElementById("foldrai-chat-btn")) {
        injectAddButtonInChatPage();
      }
    }
  }
  handleChatPage();
  const observer = new MutationObserver(() => {
    if (window.location.pathname !== lastPathname) {
      lastPathname = window.location.pathname;
      handleChatPage();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
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
      background: #343541;
      border: 1px solid #444654;
      color: #ececf1;
      font-size: 13px;
      font-weight: 500;
      border-radius: 6px;
      padding: 4px 10px;
      margin-right: 4px;
      cursor: pointer;
      transition: background 0.2s, border 0.2s;
    `;
    addBtn.onmouseover = () => {
      addBtn.style.background = "#444654";
      addBtn.style.borderColor = "#565869";
    };
    addBtn.onmouseout = () => {
      addBtn.style.background = "#343541";
      addBtn.style.borderColor = "#444654";
    };
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
          contentHTML: `<select id=\"foldr-folder-select\" style=\"width: 100%; padding: 6px 10px; font-size: 14px; border-radius: 6px; border: 1px solid #343541; background: #343541; color: #ececf1; outline: none;\">${options}</select>`,
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
