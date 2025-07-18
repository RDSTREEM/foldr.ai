// main.js
import { createModal } from "./modal.js";
import { injectSidebar } from "./sidebar.js";
import { initChatButtonNavigation } from "./chatActions.js";

window.addEventListener("load", () => {
  createModal();
  injectSidebar();
  initChatButtonNavigation();
});
