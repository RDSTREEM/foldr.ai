import { createModal } from "./modal.js";
import { injectSidebar } from "./sidebar.js";
import { initChatButtonNavigation } from "./chatActions.js";

window.addEventListener("load", () => {
  // Inject Font Awesome CDN
  const faLink = document.createElement("link");
  faLink.rel = "stylesheet";
  faLink.href =
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css";
  document.head.appendChild(faLink);

  createModal();
  injectSidebar();
  initChatButtonNavigation();
});
