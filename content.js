function injectFolderSection() {
  const nav = document.querySelector('nav[aria-label="Chat history"]');
  if (!nav) {
    console.log("Foldr.ai: sidebar not found.");
    return;
  }

  const existing = document.getElementById("foldrai-folder-header");
  if (existing) {
    console.log("Foldr.ai: already injected.");
    return;
  }

  const folderHeader = document.createElement("div");
  folderHeader.id = "foldrai-folder-header";
  folderHeader.textContent = "Folders (coming soon)";
  folderHeader.style.cssText = `
    padding: 0.5rem 1rem;
    font-size: 13px;
    font-weight: bold;
    color: #ccc;
  `;

  const stickyTop = nav.querySelector("div[class*='sticky']");
  if (stickyTop) {
    nav.insertBefore(folderHeader, stickyTop.nextSibling);
    console.log("Foldr.ai: folder section injected!");
  } else {
    console.log("Foldr.ai: sticky top section not found.");
  }
}

window.addEventListener("load", () => {
  setTimeout(() => {
    console.log("⏳ Foldr.ai: trying to inject...");
    injectFolderSection();
  }, 1500);
});
