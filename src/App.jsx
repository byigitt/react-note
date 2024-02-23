import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  const noteInputRef = useRef(null);

  useEffect(() => {
    const handleKeyPress = () => {
      noteInputRef.current.focus();
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    let storageNotes = JSON.parse(localStorage.getItem("notes"));

    if (storageNotes) {
      setNotes(storageNotes);
    }
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("notes", JSON.stringify(notes));
    }
  }, [notes]);

  const addNote = () => {
    if (newNote.trim() !== "") {
      const updatedNotes = [...notes, { id: Date.now(), text: newNote, completed: false }];
      setNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      setNewNote("");
    }
  };

  const deleteNote = (idToRemove) => {
    const updatedNotes = notes.filter((note) => note.id !== idToRemove);
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const toggleNote = (index) => {
    const updatedNotes = [...notes];
    updatedNotes[index].completed = !updatedNotes[index].completed;
    setNotes(updatedNotes);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-zinc-900 text-white">
      <div className="w-full sm:w-96 bg-zinc-800 mt-4 shadow-md p-4 mx-4 sm:mx-0">
        <div className="flex items-center mb-4">
          <input
            ref={noteInputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addNote();
              }
            }}
            type="text"
            className="w-full border border-white/15 bg-zinc-900 rounded-md py-2 px-3 mr-2 focus:outline-none text-white"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            autoFocus
          />
          <button className="bg-zinc-500 hover:bg-zinc-600 text-white rounded-md py-2 px-4" onClick={addNote}>
            Ekle
          </button>
        </div>
        {notes.length === 0 ? (
          <p className="text-gray-300">Henüz hiç notun yok.</p>
        ) : (
          <ul className="space-y-2">
            {notes.map((note, index) => (
              <li
                key={note.id}
                className={`border border-zinc-700 rounded-md py-2 px-3 ${
                  note.completed ? "text-white/10" : ""
                } hover:bg-black/10 transition-colors hover:shadow-md`}
                style={{
                  cursor: "pointer",
                  transition: "0.3s",
                  userSelect: "none",
                }}
                onClick={() => toggleNote(index)}
              >
                {note.text}
                <button
                  className="ml-2 text-gray-500 float-right hover:text-gray-400 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
