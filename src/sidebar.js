import { showModal } from "./modal.js";
import "../static/sidebar.css";

export function injectSidebar() {
  const sidebarInterval = setInterval(() => {
    const historyPanel = document.getElementById("history");
    const sidebarAside = historyPanel?.querySelector("aside");
    const menuHeader = sidebarAside?.querySelector("h2.__menu-label");
    if (!sidebarAside || !menuHeader) return;
    if (document.getElementById("foldrai-folder-section")) {
      clearInterval(sidebarInterval);
      return;
    }
    const folderSection = document.createElement("div");
    folderSection.id = "foldrai-folder-section";
    folderSection.className = "foldrai-folder-section";

    const folderSearchInput = document.createElement("input");
    folderSearchInput.type = "text";
    folderSearchInput.placeholder = "Search folders...";
    folderSearchInput.id = "foldrai-folder-search";
    folderSearchInput.className = "foldrai-folder-search";
    folderSection.appendChild(folderSearchInput);

    const folderTitle = document.createElement("div");
    folderTitle.textContent = "📂 Folders";
    folderTitle.id = "foldrai-folder-section-title";
    folderSection.appendChild(folderTitle);

    const folderListContainer = document.createElement("div");
    folderListContainer.id = "foldrai-folder-list";
    folderSection.appendChild(folderListContainer);

    const createFolderBtn = document.createElement("button");
    createFolderBtn.textContent = "+ Create Folder";
    createFolderBtn.className = "foldrai-create-folder-btn";
    createFolderBtn.onclick = () => {
      showModal({
        title: "Create Folder",
        contentHTML: `<input type=\"text\" id=\"foldr-folder-name\" class=\"foldrai-folder-search\" placeholder=\"Folder name...\" />`,
        onConfirm: () => {
          const folderName = document
            .getElementById("foldr-folder-name")
            .value.trim();
          if (!folderName) return;
          chrome.storage.local.get(["folders"], (data) => {
            const folders = data.folders || [];
            folders.push({ name: folderName, chats: [] });
            chrome.storage.local.set({ folders }, () =>
              renderFolders(folderSearchInput.value)
            );
          });
        },
      });
    };
    folderSection.appendChild(createFolderBtn);
    sidebarAside.insertBefore(folderSection, menuHeader);
    renderFolders("");
    folderSearchInput.addEventListener("input", (e) =>
      renderFolders(folderSearchInput.value)
    );
    clearInterval(sidebarInterval);
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
      wrapper.className += " foldrai-folder-wrapper";
      const nameRow = document.createElement("div");
      nameRow.className = "foldrai-folder-row";
      const name = document.createElement("div");
      name.textContent =
        (window._foldrCollapsedFolders[folder.name] ? "▶ " : "▼ ") +
        "📁 " +
        folder.name;
      name.className = "foldrai-folder-name";
      name.onclick = () => {
        window._foldrCollapsedFolders[folder.name] =
          !window._foldrCollapsedFolders[folder.name];
        renderFolders(filter);
      };
      nameRow.appendChild(name);
      // Move up button
      const upBtn = document.createElement("button");
      upBtn.textContent = "⬆️";
      upBtn.title = "Move Up";
      upBtn.className = "foldrai-folder-btn up";
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
      downBtn.className = "foldrai-folder-btn down";
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
      editBtn.className = "foldrai-folder-btn edit";
      editBtn.onclick = (e) => {
        e.stopPropagation();
        showModal({
          title: `Rename Folder`,
          contentHTML: `<input type='text' id='foldr-rename-folder' value='${folder.name}' class='foldrai-folder-search' />`,
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
      deleteBtn.className = "foldrai-folder-btn delete";
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
        chatList.className += " foldrai-chat-list";
        if (folder.chats && folder.chats.length > 0) {
          folder.chats.forEach((chat) => {
            const chatRow = document.createElement("div");
            chatRow.textContent = chat.title;
            chatRow.className = "foldrai-chat-row";
            chatRow.onclick = () => {
              window.open(chat.url, "_blank");
            };
            chatList.appendChild(chatRow);
          });
        } else {
          chatList.textContent = "(No chats in this folder)";
          chatList.className = "foldrai-chat-row empty";
        }
        wrapper.appendChild(chatList);
      }
      container.appendChild(wrapper);
    });
  });
}
