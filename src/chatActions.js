export function initChatButtonNavigation() {
  let previousPathname = window.location.pathname;
  function maybeInjectChatButton() {
    if (
      window.location.pathname.startsWith("/c/") &&
      !document.getElementById("foldrai-chat-btn")
    ) {
      injectAddButtonInChatPage();
    }
  }
  maybeInjectChatButton();
  const navObserver = new MutationObserver(() => {
    if (window.location.pathname !== previousPathname) {
      previousPathname = window.location.pathname;
      maybeInjectChatButton();
    }
  });
  navObserver.observe(document.body, { childList: true, subtree: true });
}
import { showModal } from "./modal.js";
import "../static/chatActions.css";
import { renderFolders } from "./sidebar.js";

export function injectAddButtonInChatPage() {
  if (!window.location.pathname.startsWith("/c/")) return;
  const check = setInterval(() => {
    const shareBtn = document.querySelector('button[aria-label="Share"]');
    if (!shareBtn || document.getElementById("foldrai-chat-btn")) return;
    const container = shareBtn.parentNode;
    const addBtn = document.createElement("button");
    addBtn.id = "foldrai-chat-btn";
    addBtn.className = "foldrai-chat-btn";
    addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add to Folder';
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
          contentHTML: `<select id=\"foldr-folder-select\" class=\"foldr-folder-select\">${options}</select>`,
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
