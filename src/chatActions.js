// =============================
// Imports
// =============================
import { showModal } from "./modal.js";
import { renderFolders } from "./sidebar.js";

// =============================
// Pin Folder
// =============================
/**
 * Puts a folder at the top of the list and stores it in local storage.
 * @param {number} index The index of the folder to pin.
 */
export function pinFolder(index) {
  chrome.storage.local.get(["folders"], ({ folders }) => {
    if (!folders[index].pinned) {
      folders[index].pinned = true;
      folders.sort((a, b) => (a.pinned ? -1 : b.pinned ? 1 : 0));
      chrome.storage.local.set({ folders }, renderFolders);
    }
  });
}
// =============================
// Drag and Drop
// =============================
/**
 * Starts the drag and drop functionality.
 */
export function initDragAndDrop() {
  const folderList = document.getElementById("foldrai-folder-list");
  folderList.ondragstart = (e) => {
    const folder = e.target.closest(".foldrai-folder-wrapper");
    if (!folder) return;
    e.dataTransfer.setData("text", folder.dataset.index);
    e.dataTransfer.effectAllowed = "move";
  };
  folderList.ondragover = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  folderList.ondrop = (e) => {
    e.preventDefault();
    const indexA = e.dataTransfer.getData("text");
    const indexB = e.target.closest(".foldrai-folder-wrapper").dataset.index;
    if (indexA === indexB) return;
    chrome.storage.local.get(["folders"], ({ folders }) => {
      const folderA = folders[indexA];
      const folderB = folders[indexB];
      folders.splice(indexA, 1);
      folders.splice(indexB, 0, folderA);
      chrome.storage.local.set({ folders }, renderFolders);
    });
  };
}
// =============================
// Unpin Folder
// =============================
/**
 * Unpins a folder and stores it in local storage.
 * @param {number} index The index of the folder to unpin.
 */
export function unpinFolder(index) {
  chrome.storage.local.get(["folders"], ({ folders }) => {
    if (folders[index].pinned) {
      folders[index].pinned = false;
      chrome.storage.local.set({ folders }, renderFolders);
    }
  });
}
// =============================
// Chat Button Navigation
// =============================
/**
 * Observes navigation changes and injects the chat button when needed.
 */
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

// =============================
// Inject Add Button in Chat Page
// =============================
/**
 * Injects the "Add to Folder" button into the chat page if not present.
 */
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
