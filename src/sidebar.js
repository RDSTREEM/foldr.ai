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
    section.style.cssText =
      "background: var(--background-primary, #202123); border-radius: 8px; margin: 0 0 12px 0; padding: 0.5rem 0.75rem; box-shadow: 0 1px 2px 0 #0002;";

    const searchBar = document.createElement("input");
    searchBar.type = "text";
    searchBar.placeholder = "Search folders...";
    searchBar.id = "foldrai-folder-search";
    searchBar.style.cssText =
      "width: 100%; margin-bottom: 0.5rem; padding: 6px 10px; font-size: 14px; border-radius: 6px; border: 1px solid #343541; background: #343541; color: #ececf1; outline: none;";
    section.appendChild(searchBar);

    const title = document.createElement("div");
    title.textContent = "📂 Folders";
    title.style.cssText =
      "font-size: 14px; font-weight: 600; color: #ececf1; margin-bottom: 0.5rem; letter-spacing: 0.01em;";
    section.appendChild(title);

    const folderList = document.createElement("div");
    folderList.id = "foldrai-folder-list";
    section.appendChild(folderList);

    const createBtn = document.createElement("button");
    createBtn.textContent = "+ Create Folder";
    createBtn.style.cssText =
      "background: #343541; border: 1px solid #444654; color: #ececf1; font-size: 13px; font-weight: 500; border-radius: 6px; padding: 5px 12px; margin-top: 8px; cursor: pointer; transition: background 0.2s, border 0.2s;";
    createBtn.onmouseover = () => {
      createBtn.style.background = "#444654";
      createBtn.style.borderColor = "#565869";
    };
    createBtn.onmouseout = () => {
      createBtn.style.background = "#343541";
      createBtn.style.borderColor = "#444654";
    };
    createBtn.onclick = () => {
      showModal({
        title: "Create Folder",
        contentHTML: `<input type=\"text\" id=\"foldr-folder-name\" placeholder=\"Folder name...\" style=\"width: 100%; padding: 6px 10px; font-size: 14px; border-radius: 6px; border: 1px solid #343541; background: #343541; color: #ececf1; outline: none;\" />`,
        onConfirm: () => {
          const name = document
            .getElementById("foldr-folder-name")
            .value.trim();
          if (!name) return;
          chrome.storage.local.get(["folders"], (data) => {
            const folders = data.folders || [];
            folders.push({ name, chats: [] });
            chrome.storage.local.set({ folders }, () =>
              renderFolders(searchBar.value)
            );
          });
        },
      });
    };
    section.appendChild(createBtn);
    aside.insertBefore(section, chatsHeader);
    renderFolders("");
    searchBar.addEventListener("input", (e) => renderFolders(searchBar.value));
    clearInterval(check);
  }, 500);
}

// Renders the folder list, with search, reorder, edit, and delete functionality
export function renderFolders(filter = "") {
  chrome.storage.local.get(["folders"], (data) => {
    let folders = data.folders || [];
    const container = document.getElementById("foldrai-folder-list");
    if (!container) return;
    container.innerHTML = "";
    // Filter folders by search
    if (filter) {
      folders = folders.filter((f) =>
        f.name.toLowerCase().includes(filter.toLowerCase())
      );
    }
    // Track collapsed state in memory
    if (!window._foldrCollapsedFolders) window._foldrCollapsedFolders = {};
    folders.forEach((folder, folderIdx) => {
      const wrapper = document.createElement("div");
      wrapper.style.marginBottom = "6px";
      const nameRow = document.createElement("div");
      nameRow.style.display = "flex";
      nameRow.style.alignItems = "center";
      nameRow.style.gap = "2px";
      nameRow.style.padding = "2px 0";
      nameRow.style.borderRadius = "4px";
      nameRow.style.transition = "background 0.2s";
      nameRow.onmouseover = () => {
        nameRow.style.background = "#2a2b32";
      };
      nameRow.onmouseout = () => {
        nameRow.style.background = "";
      };
      const name = document.createElement("div");
      name.textContent =
        (window._foldrCollapsedFolders[folder.name] ? "▶ " : "▼ ") +
        "📁 " +
        folder.name;
      name.style.cssText =
        "font-size: 14px; color: #ececf1; font-weight: 500; cursor: pointer; flex: 1; padding: 2px 0;";
      name.onclick = () => {
        window._foldrCollapsedFolders[folder.name] =
          !window._foldrCollapsedFolders[folder.name];
        renderFolders(filter);
      };
      nameRow.appendChild(name);
      // ...existing code for upBtn, downBtn, editBtn, deleteBtn...
      // Move up button
      const upBtn = document.createElement("button");
      upBtn.textContent = "⬆️";
      upBtn.title = "Move Up";
      upBtn.style.cssText =
        "background: none; border: none; color: #aaa; font-size: 15px; cursor: pointer; margin-left: 4px; border-radius: 4px; padding: 2px;";
      upBtn.disabled = folderIdx === 0;
      upBtn.onclick = (e) => {
        e.stopPropagation();
        chrome.storage.local.get(["folders"], (data) => {
          const folders = data.folders || [];
          if (folderIdx > 0) {
            [folders[folderIdx - 1], folders[folderIdx]] = [
              folders[folderIdx],
              folders[folderIdx - 1],
            ];
            chrome.storage.local.set({ folders }, () => renderFolders(filter));
          }
        });
      };
      nameRow.appendChild(upBtn);
      // Move down button
      const downBtn = document.createElement("button");
      downBtn.textContent = "⬇️";
      downBtn.title = "Move Down";
      downBtn.style.cssText =
        "background: none; border: none; color: #aaa; font-size: 15px; cursor: pointer; margin-left: 2px; border-radius: 4px; padding: 2px;";
      downBtn.disabled = folderIdx === folders.length - 1;
      downBtn.onclick = (e) => {
        e.stopPropagation();
        chrome.storage.local.get(["folders"], (data) => {
          const folders = data.folders || [];
          if (folderIdx < folders.length - 1) {
            [folders[folderIdx + 1], folders[folderIdx]] = [
              folders[folderIdx],
              folders[folderIdx + 1],
            ];
            chrome.storage.local.set({ folders }, () => renderFolders(filter));
          }
        });
      };
      nameRow.appendChild(downBtn);
      // Edit button
      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️";
      editBtn.title = "Edit Folder Name";
      editBtn.style.cssText =
        "background: none; border: none; color: #4caf50; font-size: 15px; cursor: pointer; margin-left: 4px; border-radius: 4px; padding: 2px;";
      editBtn.onclick = (e) => {
        e.stopPropagation();
        showModal({
          title: `Rename Folder`,
          contentHTML: `<input type='text' id='foldr-rename-folder' value='${folder.name}' style='width: 100%; padding: 6px 10px; font-size: 14px; border-radius: 6px; border: 1px solid #343541; background: #343541; color: #ececf1; outline: none;' />`,
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
              chrome.storage.local.set({ folders }, () =>
                renderFolders(filter)
              );
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
        "background: none; border: none; color: #e57373; font-size: 15px; cursor: pointer; margin-left: 4px; border-radius: 4px; padding: 2px;";
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        showModal({
          title: `Delete Folder`,
          contentHTML: `<div>Are you sure you want to delete the folder '<b>${folder.name}</b>' and all its chats?</div>`,
          onConfirm: () => {
            chrome.storage.local.get(["folders"], (data) => {
              const folders = data.folders || [];
              folders.splice(folderIdx, 1);
              chrome.storage.local.set({ folders }, () =>
                renderFolders(filter)
              );
            });
          },
        });
      };
      nameRow.appendChild(deleteBtn);
      wrapper.appendChild(nameRow);
      // Collapsible chat list
      if (!window._foldrCollapsedFolders[folder.name]) {
        const chatList = document.createElement("div");
        chatList.style.marginLeft = "18px";
        chatList.style.marginTop = "2px";
        chatList.style.marginBottom = "4px";
        if (folder.chats && folder.chats.length > 0) {
          folder.chats.forEach((chat) => {
            const chatRow = document.createElement("div");
            chatRow.textContent = chat.title;
            chatRow.style.cssText =
              "font-size: 13px; color: #bcbcbc; padding: 2px 0; cursor: pointer;";
            chatRow.onclick = () => {
              window.open(chat.url, "_blank");
            };
            chatList.appendChild(chatRow);
          });
        } else {
          chatList.textContent = "(No chats in this folder)";
          chatList.style.color = "#666";
        }
        wrapper.appendChild(chatList);
      }
      container.appendChild(wrapper);
    });
  });
}
