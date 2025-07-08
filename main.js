// main.js
import { createModal } from "./modal.js";
import { injectSidebar } from "./sidebar.js";
import { injectAddButtonInChatPage } from "./chatActions.js";

window.addEventListener("load", () => {
  createModal();
  injectSidebar();
  injectAddButtonInChatPage();
});
