function createModal() {
  const overlay = document.createElement("div");
  overlay.id = "foldrai-modal-overlay";
  overlay.innerHTML = `
    <div id="foldrai-modal">
      <h2 id="foldrai-modal-title">Modal Title</h2>
      <div id="foldrai-modal-content"></div>
      <div>
        <button id="foldrai-modal-confirm">Confirm</button>
        <button id="foldrai-modal-cancel" class="cancel-btn">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Cancel button hides modal
  document.getElementById("foldrai-modal-cancel").onclick = () => {
    overlay.style.display = "none";
  };
}

function showModal({ title, contentHTML, onConfirm }) {
  const overlay = document.getElementById("foldrai-modal-overlay");
  const titleEl = document.getElementById("foldrai-modal-title");
  const contentEl = document.getElementById("foldrai-modal-content");
  const confirmBtn = document.getElementById("foldrai-modal-confirm");

  titleEl.textContent = title;
  contentEl.innerHTML = contentHTML;

  confirmBtn.onclick = () => {
    onConfirm();
    overlay.style.display = "none";
  };

  overlay.style.display = "flex";
}

function injectSidebar() {
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
        contentHTML: `<input type="text" id="foldr-folder-name" placeholder="Folder name..." />`,
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

      folder.chats.forEach((chat, chatIdx) => {
        // Add pin icon/button
        const linkWrapper = document.createElement("div");
        linkWrapper.style.display = "flex";
        linkWrapper.style.alignItems = "center";

        const link = document.createElement("a");
        link.href = chat.url;
        link.textContent = chat.title;
        link.style.cssText =
          "display: block; color: #aaa; font-size: 12px; text-decoration: none; flex: 1;";
        link.target = "_blank";
        linkWrapper.appendChild(link);

        const pinBtn = document.createElement("button");
        pinBtn.textContent = chat.pinned ? "📌" : "📍";
        pinBtn.title = chat.pinned ? "Unpin" : "Pin";
        pinBtn.style.cssText =
          "background: none; border: none; color: #ffd700; font-size: 14px; cursor: pointer; margin-left: 4px;";
        pinBtn.onclick = (e) => {
          e.stopPropagation();
          chrome.storage.local.get(["folders"], (data) => {
            const folders = data.folders || [];
            const chats = folders.find((f) => f.name === folder.name)?.chats;
            if (!chats) return;
            chats[chatIdx].pinned = !chats[chatIdx].pinned;
            chrome.storage.local.set({ folders }, renderFolders);
          });
        };
        linkWrapper.appendChild(pinBtn);
        chatList.appendChild(linkWrapper);
      });

      // Sort chats: pinned first
      folder.chats.sort((a, b) => (b.pinned === true) - (a.pinned === true));

      name.onclick = () => {
        chatList.style.display =
          chatList.style.display === "none" ? "block" : "none";
      };

      wrapper.appendChild(chatList);
      container.appendChild(wrapper);
    });
  });
}

function injectAddButtonInChatPage() {
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
          contentHTML: `<select id="foldr-folder-select">${options}</select>`,
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

window.addEventListener("load", () => {
  createModal();
  injectSidebar();
  injectAddButtonInChatPage();
});
