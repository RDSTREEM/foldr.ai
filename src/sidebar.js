import { showModal } from "./modal.js";

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
    folderSection.className = "foldrai-folder-section";
    folderSection.className = "foldrai-folder-section";

    const folderSearchInput = document.createElement("input");
    folderSearchInput.type = "text";
    folderSearchInput.className = "foldrai-folder-search";
    folderSearchInput.id = "foldrai-folder-search";
    folderSearchInput.className = "foldrai-folder-search";
    folderSection.appendChild(folderSearchInput);

    const folderTitle = document.createElement("div");
    folderTitle.className = "foldrai-folder-section-title";
    folderTitle.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><path d="M3 7V5a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg> Folders`;
    folderTitle.id = "foldrai-folder-section-title";
    folderSection.appendChild(folderTitle);

    const folderListContainer = document.createElement("div");
    folderListContainer.className = "foldrai-folder-list";
    folderListContainer.id = "foldrai-folder-list";
    folderSection.appendChild(folderListContainer);

    const createFolderBtn = document.createElement("button");
    createFolderBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Create Folder`;
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
    // Fetch folders from storage and render
    chrome.storage.local.get(["folders"], (data) => {
      renderFolders("", data.folders || []);
    });
    folderSearchInput.addEventListener("input", (e) => {
      chrome.storage.local.get(["folders"], (data) => {
        renderFolders(folderSearchInput.value, data.folders || []);
      });
    });
    clearInterval(sidebarInterval);
  }, 500);
}

// Renders the folder list, with search, reorder, edit, and delete functionality
export function renderFolders(filter = "", folders = []) {
  const container = document.getElementById("foldrai-folder-list");
  if (!container) return;
  container.innerHTML = "";
  // Filter folders by search
  let filteredFolders = folders;
  if (filter) {
    filteredFolders = folders.filter((f) =>
      f.name.toLowerCase().includes(filter.toLowerCase())
    );
  }
  // Track collapsed state in memory
  if (!window._foldrCollapsedFolders) window._foldrCollapsedFolders = {};
  filteredFolders.forEach((folder, folderIdx) => {
    const wrapper = document.createElement("div");
    wrapper.className += " foldrai-folder-wrapper";
    const nameRow = document.createElement("div");
    nameRow.className = "foldrai-folder-row";
    const name = document.createElement("div");
    name.className = "foldrai-folder-name foldrai-folder-row-flex";
    name.innerHTML =
      (window._foldrCollapsedFolders[folder.name]
        ? `<span class='foldrai-folder-icon'><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></span>`
        : `<span class='foldrai-folder-icon'><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>`) +
      `<span class='foldrai-folder-icon'><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg></span>` +
      `<span class='foldrai-folder-label'>${folder.name}</span>`;
    name.onclick = () => {
      window._foldrCollapsedFolders[folder.name] =
        !window._foldrCollapsedFolders[folder.name];
      renderFolders(filter);
    };
    nameRow.appendChild(name);
    // Move up button
    const upBtn = document.createElement("button");
    upBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><polyline points="18 15 12 9 6 15"/></svg>`;
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
    downBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><polyline points="6 9 12 15 18 9"/></svg>`;
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
    editBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>`;
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
            if (folders.some((f, i) => f.name === newName && i !== folderIdx)) {
              alert("A folder with that name already exists.");
              return;
            }
            folders[folderIdx].name = newName;
            chrome.storage.local.set({ folders }, () => renderFolders(filter));
          });
        },
      });
    };
    nameRow.appendChild(editBtn);
    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m5 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>`;
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
            chrome.storage.local.set({ folders }, () => renderFolders(filter));
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
}
