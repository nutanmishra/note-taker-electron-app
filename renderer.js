document.addEventListener("DOMContentLoaded", () => {
  const noteTitle = document.getElementById("noteTitle");
  const noteContent = document.getElementById("noteContent");
  const saveNoteBtn = document.getElementById("saveNote");
  const notesList = document.getElementById("notesList");

  // Load notes on startup
  loadNotes();

  // Save note button event listener
  saveNoteBtn.addEventListener("click", async () => {
    const note = {
      title: noteTitle.value.trim(),
      content: noteContent.value.trim(),
    };

    console.log("Attempting to save note:", note);

    if (!note.title || !note.content) {
      alert("Please enter both a title and content for the note.");
      return;
    }

    const result = await window.electronAPI.saveNote(note);
    if (result.success) {
      console.log("Note saved, refreshing UI");
      noteTitle.value = "";
      noteContent.value = "";
      loadNotes();
    } else {
      console.error("Failed to save note:", result.error);
      alert("Error saving note: " + result.error);
    }
  });

  // Load and display notes
  async function loadNotes() {
    console.log("Loading notes...");
    const result = await window.electronAPI.loadNotes();
    if (result.success) {
      notesList.innerHTML = "";
      result.notes.forEach((note) => {
        const noteElement = document.createElement("div");
        noteElement.className = "note-card bg-white p-6 rounded-lg shadow-md";
        noteElement.innerHTML = `
             <h3 class="text-xl font-semibold text-gray-800 mb-2">${note.title}</h3>
             <p class="text-gray-600 mb-4">${note.content}</p>
             <button class="delete-btn w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200" data-id="${note.id}">Delete</button>
           `;
        notesList.appendChild(noteElement);
      });

      // Add event listeners for delete buttons
      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", async () => {
          const id = parseInt(button.getAttribute("data-id"));
          console.log("Attempting to delete note with ID:", id);
          const result = await window.electronAPI.deleteNote(id);
          if (result.success) {
            console.log("Note deleted, refreshing UI");
            loadNotes();
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
});
