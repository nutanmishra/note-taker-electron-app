const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs-extra");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile("index.html");

  // Open DevTools for debugging
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Handle IPC for saving notes
ipcMain.handle("save-note", async (event, note) => {
  try {
    const notesPath = path.join(app.getPath("userData"), "notes.json");
    // console.log("Saving note to:", notesPath);
    let notes = [];

    if (await fs.pathExists(notesPath)) {
      // console.log("Reading existing notes file");
      notes = await fs.readJson(notesPath);
    }

    notes.push({ ...note, id: Date.now() });
    await fs.writeJson(notesPath, notes, { spaces: 2 });
    // console.log("Note saved successfully:", note);
    return { success: true, notes };
  } catch (error) {
    // console.error("Error saving note:", error);
    return { success: false, error: error.message };
  }
});

// Handle IPC for loading notes
ipcMain.handle("load-notes", async () => {
  try {
    const notesPath = path.join(app.getPath("userData"), "notes.json");
    // console.log("Loading notes from:", notesPath);
    if (await fs.pathExists(notesPath)) {
      const notes = await fs.readJson(notesPath);
      // console.log("Loaded notes:", notes);
      return { success: true, notes };
    }
    // console.log("No notes file found, returning empty array");
    return { success: true, notes: [] };
  } catch (error) {
    // console.error("Error loading notes:", error);
    return { success: false, error: error.message };
  }
});

// Handle IPC for deleting notes
ipcMain.handle("delete-note", async (event, id) => {
  try {
    const notesPath = path.join(app.getPath("userData"), "notes.json");
    // console.log("Deleting note with ID:", id);
    let notes = [];

    if (await fs.pathExists(notesPath)) {
      notes = await fs.readJson(notesPath);
    }

    notes = notes.filter((note) => note.id !== id);
    await fs.writeJson(notesPath, notes, { spaces: 2 });
    // console.log("Note deleted successfully, updated notes:", notes);
    return { success: true, notes };
  } catch (error) {
    // console.error("Error deleting note:", error);
    return { success: false, error: error.message };
  }
});
