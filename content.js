function addFolderHeader() {
  const sidebar = document.querySelector("nav");
  if (!sidebar) {
    setTimeout(addFolderHeader, 500);
    return;
  }

  if (document.getElementById("foldr-folder-header")) return;

  const gptsButton = Array.from(sidebar.querySelectorAll("a")).find((a) =>
    a.textContent.includes("GPTs")
  );

  if (gptsButton) {
    const folderHeader = document.createElement("div");
    folderHeader.id = "pinfold-folder-header";
    folderHeader.textContent = "Folders";
    folderHeader.style.cssText =
      "padding: 8px 12px; color: #aaa; font-size: 13px;";
    gptsButton.parentNode.insertBefore(folderHeader, gptsButton.nextSibling);
  }
}

window.addEventListener("load", () => {
  setTimeout(addFolderHeader, 2000);
});
