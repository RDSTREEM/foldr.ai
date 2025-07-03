function injectFolderSection() {
  const checkInterval = setInterval(() => {
    const historyDiv = document.getElementById("history");
    if (!historyDiv) {
      console.log("Foldr.ai: waiting for #history...");
      return;
    }

    const aside = historyDiv.querySelector("aside");
    const chatsHeader = aside?.querySelector("h2.__menu-label");

    if (!aside || !chatsHeader) {
      console.log("Foldr.ai: waiting for chats section...");
      return;
    }

    const existing = document.getElementById("foldrai-folder-header");
    if (existing) {
      console.log("Foldr.ai: already injected.");
      clearInterval(checkInterval);
      return;
    }

    const folderHeader = document.createElement("div");
    folderHeader.id = "foldrai-folder-header";
    folderHeader.innerHTML = `<div style="
      padding: 0.5rem 1rem;
      font-size: 13px;
      font-weight: bold;
      color: #ccc;
    ">Folders (coming soon)</div>`;

    aside.insertBefore(folderHeader, chatsHeader);
    console.log("Foldr.ai: folder section injected above chat list!");
    clearInterval(checkInterval);
  }, 500);
}

window.addEventListener("load", () => {
  injectFolderSection();
});
