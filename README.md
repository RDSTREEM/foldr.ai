# Foldr.ai Chrome Extension

This is a Chrome extension that adds folder management and chat organization features to a chat-based web application (such as ChatGPT).

## Features
- **Sidebar Folders:** Organize your chats into custom folders in the sidebar.
- **Add Chat to Folder:** Add the current chat to a folder directly from the chat page.
- **Pin Chats:** Pin important chats within folders for quick access.
- **Modal Dialogs:** User-friendly modals for creating folders and adding chats.

## How It Works
- The extension injects a sidebar section for folders and a button on chat pages to add chats to folders.
- Data is stored using `chrome.storage.local` for persistence.
- UI is managed with vanilla JavaScript and styled via `style.css`.

## Installation
1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable "Developer mode" (top right).
4. Click "Load unpacked" and select this project folder.

## File Overview
- `content.js`: Main logic for UI injection, folder management, and chat organization.
- `manifest.json`: Chrome extension manifest file.
- `style.css`: Custom styles for the extension UI.

## Usage
- Use the sidebar to create folders and view chats.
- On a chat page, use the "Add to Folder" button to save the chat to a folder.
- Pin/unpin chats for easy access.

## License
MIT License.
