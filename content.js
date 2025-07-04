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

    const addBtn = document.createElement("button");
    addBtn.textContent = "+ Add Folder";
    addBtn.style.cssText =
      "background: none; border: none; color: #4caf50; font-size: 13px; cursor: pointer;";
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

    const addToFolderBtn = document.createElement("button");
    addToFolderBtn.textContent = "➕ Add Chat to Folder";
    addToFolderBtn.style.cssText =
      "background: none; border: none; color: #2196f3; font-size: 13px; cursor: pointer; display: block; margin-top: 4px;";
    addToFolderBtn.onclick = () => {
      const title = document.title.replace(" - ChatGPT", "").trim();
      const url = window.location.href;

      chrome.storage.local.get(["folders"], (data) => {
        const folders = data.folders || [];
        if (folders.length === 0) {
          alert("No folders yet. Please add one first.");
          return;
        }

        const folderNames = folders.map((f) => f.name).join("\n");
        const chosen = prompt(`Add chat to which folder?\n\n${folderNames}`);
        if (!chosen) return;

        const folder = folders.find((f) => f.name === chosen);
        if (!folder) {
          alert("Folder not found.");
          return;
        }

        // Prevent duplicates
        if (!folder.chats.some((c) => c.url === url)) {
          folder.chats.push({ title, url });
          chrome.storage.local.set({ folders }, renderFolders);
        } else {
          alert("This chat is already in that folder.");
        }
      });
    };
    section.appendChild(addToFolderBtn);

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
      const wrapper = document.createElement("div");
      wrapper.style.marginBottom = "6px";

      const name = document.createElement("div");
      name.textContent = "📁 " + folder.name;
      name.style.cssText =
        "font-size: 13px; color: white; font-weight: 500; cursor: pointer;";
      wrapper.appendChild(name);

      const chatList = document.createElement("div");
      chatList.style.marginLeft = "10px";
      chatList.style.display = "none";

      folder.chats.forEach((chat) => {
        const link = document.createElement("a");
        link.href = chat.url;
        link.textContent = chat.title;
        link.style.cssText =
          "display: block; color: #aaa; font-size: 12px; text-decoration: none;";
        link.target = "_blank";
        chatList.appendChild(link);
      });

      name.addEventListener("click", () => {
        chatList.style.display =
          chatList.style.display === "none" ? "block" : "none";
      });

      wrapper.appendChild(chatList);
      container.appendChild(wrapper);
    });
  });
}

window.addEventListener("load", () => {
  injectFolderSection();
});
