// sidebar.js
import { showModal } from "./modal.js";

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
  chrome.storage.local.get(["folders"], (data) => {
    const folders = data.folders || [];
    const container = document.getElementById("foldrai-folder-list");
    if (!container) return;
    container.innerHTML = "";

    folders.forEach((folder, folderIdx) => {
      const wrapper = document.createElement("div");
      wrapper.style.marginBottom = "6px";

      const nameRow = document.createElement("div");
      nameRow.style.display = "flex";
      nameRow.style.alignItems = "center";

      const name = document.createElement("div");
      name.textContent = "📁 " + folder.name;
      name.style.cssText =
        "font-size: 13px; color: white; font-weight: 500; cursor: pointer; flex: 1;";
      nameRow.appendChild(name);

      // Edit button
      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️";
      editBtn.title = "Edit Folder Name";
      editBtn.style.cssText =
        "background: none; border: none; color: #4caf50; font-size: 14px; cursor: pointer; margin-left: 4px;";
      editBtn.onclick = (e) => {
        e.stopPropagation();
        showModal({
          title: `Rename Folder`,
          contentHTML: `<input type='text' id='foldr-rename-folder' value='${folder.name}' />`,
          onConfirm: () => {
            const newName = document
              .getElementById("foldr-rename-folder")
              .value.trim();
            if (!newName) return;
            chrome.storage.local.get(["folders"], (data) => {
              const folders = data.folders || [];
              if (
                folders.some((f, i) => f.name === newName && i !== folderIdx)
              ) {
                alert("A folder with that name already exists.");
                return;
              }
              folders[folderIdx].name = newName;
              chrome.storage.local.set({ folders }, renderFolders);
            });
          },
        });
      };
      nameRow.appendChild(editBtn);

      // Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️";
      deleteBtn.title = "Delete Folder";
      deleteBtn.style.cssText =
        "background: none; border: none; color: #e57373; font-size: 14px; cursor: pointer; margin-left: 4px;";
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        showModal({
          title: `Delete Folder`,
          contentHTML: `<div>Are you sure you want to delete the folder '<b>${folder.name}</b>' and all its chats?</div>`,
          onConfirm: () => {
            chrome.storage.local.get(["folders"], (data) => {
              const folders = data.folders || [];
              folders.splice(folderIdx, 1);
              chrome.storage.local.set({ folders }, renderFolders);
            });
          },
        });
      };
      nameRow.appendChild(deleteBtn);

      wrapper.appendChild(nameRow);
      container.appendChild(wrapper);
    });
  });
}
