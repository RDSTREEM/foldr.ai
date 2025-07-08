// sidebar.js
import { showModal } from "./modal.js";
import { renderFolders } from "./sidebar.js";

export function injectSidebar() {
  const check = setInterval(() => {
    const history = document.getElementById("history");
    const aside = history?.querySelector("aside");
    const chatsHeader = aside?.querySelector("h2.__menu-label");

    if (!aside || !chatsHeader) return;

    if (document.getElementById("foldrai-folder-section")) {
      clearInterval(check);
      return;
    }

    const section = document.createElement("div");
    section.id = "foldrai-folder-section";
    section.style.padding = "0.5rem 1rem";

    const title = document.createElement("div");
    title.textContent = "📂 Folders";
    title.style.cssText =
      "font-size: 13px; font-weight: bold; color: #ccc; margin-bottom: 0.5rem;";
    section.appendChild(title);

    const folderList = document.createElement("div");
    folderList.id = "foldrai-folder-list";
    section.appendChild(folderList);

    const createBtn = document.createElement("button");
    createBtn.textContent = "+ Create Folder";
    createBtn.style.cssText =
      "background: none; border: none; color: #4caf50; font-size: 13px; cursor: pointer;";
    createBtn.onclick = () => {
      showModal({
        title: "Create Folder",
        contentHTML: `<input type=\"text\" id=\"foldr-folder-name\" placeholder=\"Folder name...\" />`,
        onConfirm: () => {
          const name = document.getElementById("foldr-folder-name").value;
          if (!name) return;
          chrome.storage.local.get(["folders"], (data) => {
            const folders = data.folders || [];
            folders.push({ name, chats: [] });
            chrome.storage.local.set({ folders }, renderFolders);
          });
        },
      });
    };

    section.appendChild(createBtn);
    aside.insertBefore(section, chatsHeader);
    renderFolders();
    clearInterval(check);
  }, 500);
}

export function renderFolders() {
  // ...existing renderFolders code, import showModal from modal.js...
}
