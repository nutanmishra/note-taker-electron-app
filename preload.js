const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  saveNote: (note) => ipcRenderer.invoke("save-note", note),
  loadNotes: () => ipcRenderer.invoke("load-notes"),
  deleteNote: (id) => ipcRenderer.invoke("delete-note", id),
  saveTheme: (theme) => ipcRenderer.invoke("save-theme", theme),
  loadTheme: () => ipcRenderer.invoke("load-theme"),
});
