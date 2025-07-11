document.addEventListener("DOMContentLoaded", () => {
  const noteTitle = document.getElementById("noteTitle");
  const noteContent = document.getElementById("noteContent");
  const noteCategory = document.getElementById("noteCategory");
  const saveNoteBtn = document.getElementById("saveNote");
  const cancelEditBtn = document.getElementById("cancelEdit");
  const notesList = document.getElementById("notesList");
  const searchInput = document.getElementById("searchInput");
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  let editingNoteId = null;
  let marked = null;

  // Load theme and notes on startup
  loadTheme();
  loadNotes();

  // Theme toggle
  themeToggle.addEventListener("click", async () => {
    const isDark = document.body.classList.toggle("dark");
    const theme = isDark ? "dark" : "light";
    themeIcon.innerHTML = isDark
      ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>`
      : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>`;
    const result = await window.electronAPI.saveTheme(theme);
    if (!result.success) {
      console.error("Failed to save theme:", result.error);
    }
  });

  // Save note
  saveNoteBtn.addEventListener("click", async () => {
    const note = {
      title: noteTitle.value.trim(),
      content: noteContent.value.trim(),
      category: noteCategory.value || "Uncategorized",
      id: editingNoteId,
    };

    console.log("Attempting to save note:", note);

    if (!note.title || !note.content) {
      alert("Please enter both a title and content for the note.");
      return;
    }

    const result = await window.electronAPI.saveNote(note);
    if (result.success) {
      console.log("Note saved, refreshing UI");
      resetForm();
      loadNotes();
    } else {
      console.error("Failed to save note:", result.error);
      alert("Error saving note: " + result.error);
    }
  });

  // Cancel edit
  cancelEditBtn.addEventListener("click", () => {
    resetForm();
  });

  // Search notes
  searchInput.addEventListener("input", () => {
    loadNotes(searchInput.value.trim().toLowerCase());
  });

  // Load theme
  async function loadTheme() {
    const result = await window.electronAPI.loadTheme();
    if (result.success) {
      if (result.theme === "dark") {
        document.body.classList.add("dark");
        themeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>`;
      }
    } else {
      console.error("Failed to load theme:", result.error);
    }
  }

  // Load and display notes
  async function loadNotes(searchTerm = "") {
    console.log("Loading notes...");
    const result = await window.electronAPI.loadNotes();
    if (result.success) {
      notesList.innerHTML = "";
      const filteredNotes = searchTerm
        ? result.notes.filter(
            (note) =>
              note.title.toLowerCase().includes(searchTerm) ||
              note.content.toLowerCase().includes(searchTerm)
          )
        : result.notes;
      filteredNotes.forEach((note) => {
        const noteElement = document.createElement("div");
        noteElement.className =
          "note-card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md";
        noteElement.innerHTML = `
          <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">${
            note.title
          }</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">${
            note.category
          }</p>
          <div class="markdown-content text-gray-600 dark:text-gray-300 mb-4">${marked.parse(
            note.content
          )}</div>
          <div class="flex space-x-4">
            <button class="edit-btn flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-200" data-id="${
              note.id
            }">Edit</button>
            <button class="delete-btn flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200" data-id="${
              note.id
            }">Delete</button>
          </div>
        `;
        notesList.appendChild(noteElement);
      });

      // Add event listeners for edit and delete buttons
      document.querySelectorAll(".edit-btn").forEach((button) => {
        button.addEventListener("click", () => {
          const id = parseInt(button.getAttribute("data-id"));
          const note = result.notes.find((n) => n.id === id);
          noteTitle.value = note.title;
          noteContent.value = note.content;
          noteCategory.value = note.category;
          editingNoteId = id;
          saveNoteBtn.textContent = "Update Note";
          cancelEditBtn.classList.remove("hidden");
        });
      });

      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", async () => {
          const id = parseInt(button.getAttribute("data-id"));
          console.log("Attempting to delete note with ID:", id);
          const result = await window.electronAPI.deleteNote(id);
          if (result.success) {
            console.log("Note deleted, refreshing UI");
            resetForm();
            loadNotes(searchInput.value.trim().toLowerCase());
          } else {
            console.error("Failed to delete note:", result.error);
            alert("Error deleting note: " + result.error);
          }
        });
      });
    } else {
      console.error("Failed to load notes:", result.error);
      alert("Error loading notes: " + result.error);
    }
  }

  // Reset form
  function resetForm() {
    noteTitle.value = "";
    noteContent.value = "";
    noteCategory.value = "";
    editingNoteId = null;
    saveNoteBtn.textContent = "Save Note";
    cancelEditBtn.classList.add("hidden");
  }
});
