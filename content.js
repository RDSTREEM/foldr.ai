function injectFolderSection() {
  const checkSidebar = setInterval(() => {
    const nav = document.querySelector('nav[aria-label="Chat history"]');
    if (!nav) return;

    const existing = document.getElementById("foldrai-folder-header");
    if (existing) {
      clearInterval(checkSidebar);
      return;
    }

    const folderHeader = document.createElement("div");
    folderHeader.id = "foldrai-folder-header";
    folderHeader.textContent = "📂 Folders (coming soon)";
    folderHeader.style.cssText = `
      padding: 0.5rem 1rem;
      font-size: 13px;
      font-weight: bold;
      color: #ccc;
    `;

    const stickyTopBlock = nav.querySelector("div[class*='sticky']");
    if (stickyTopBlock) {
      nav.insertBefore(folderHeader, stickyTopBlock.nextSibling);
      clearInterval(checkSidebar);
    }
  }, 500);
}

window.addEventListener("load", () => {
  setTimeout(injectFolderSection, 1500);
});
