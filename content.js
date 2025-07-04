function injectFolderSection() {
  const checkInterval = setInterval(() => {
    const historyDiv = document.getElementById("history");
    const aside = historyDiv?.querySelector("aside");
    const chatsHeader = aside?.querySelector("h2.__menu-label");

    if (!aside || !chatsHeader) return;

    if (document.getElementById("foldrai-folder-section")) {
      clearInterval(checkInterval);
      return;
    }

    // Create full folder section
    const section = document.createElement("div");
    section.id = "foldrai-folder-section";
    section.style.padding = "0.5rem 1rem";

    const title = document.createElement("div");
    title.textContent = "📂 Folders";
    title.style.cssText = `
      font-size: 13px;
      font-weight: bold;
      color: #ccc;
      margin-bottom: 0.5rem;
    `;
    section.appendChild(title);

    const folderList = document.createElement("div");
    folderList.id = "foldrai-folder-list";
    section.appendChild(folderList);

    const addBtn = document.createElement("button");
    addBtn.textContent = "+ Add Folder";
    addBtn.style.cssText = `
      background: none;
      border: none;
      color: #4caf50;
      font-size: 13px;
      cursor: pointer;
      padding: 2px 0;
    `;
    addBtn.onclick = () => {
      const name = prompt("Folder name:");
      if (!name) return;
      chrome.storage.local.get(["folders"], (data) => {
        const folders = data.folders || [];
        folders.push({ name, chats: [] });
        chrome.storage.local.set({ folders }, renderFolders);
      });
    };

    section.appendChild(addBtn);
    aside.insertBefore(section, chatsHeader);

    renderFolders();
    clearInterval(checkInterval);
  }, 500);
}

function renderFolders() {
  chrome.storage.local.get(["folders"], (data) => {
    const folders = data.folders || [];
    const container = document.getElementById("foldrai-folder-list");
    if (!container) return;

    container.innerHTML = "";

    folders.forEach((folder) => {
      const div = document.createElement("div");
      div.textContent = "📁 " + folder.name;
      div.style.cssText = `
        font-size: 13px;
        color: white;
        margin-bottom: 2px;
        cursor: default;
      `;
      container.appendChild(div);
    });
  });
}

window.addEventListener("load", () => {
  injectFolderSection();
});
