import "./App.css";
import { Note } from "./components/note";
import { useEffect, useState } from "react";
import { http } from "./utils/http";

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("new Note");
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    http.getAllNotes().then((res) => setNotes(res));
  }, []);

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
      id: notes.length + 1,
    };

    http.postNotes(noteObject).then((res) => {
      setNotes([...notes, res]);
      setNewNote("");
    });
  };

  const handleOnChange = (event) => {
    setNewNote(event.target.value);
  };

  const taggleNoteImportant = (id) => {
    let _note = notes.find((note) => note.id === id);

    http
      .updateNote(id, {
        ..._note,
        important: !_note.important,
      })
      .then((res) => {
        let changedNote = res;
        setNotes([
          ...notes.map((note) =>
            note.id === changedNote.id ? changedNote : note
          ),
        ]);
      });
  };

  return (
    <div className="App">
      <h1>Note</h1>
      <ul>
        {notesToShow.map((note) => (
          <Note
            content={note.content}
            onClick={() => taggleNoteImportant(note.id)}
            key={note.id}
          />
        ))}
      </ul>
      <form>
        <input value={newNote} onChange={handleOnChange} />
        <button type={"submit"} onClick={addNote}>
          save
        </button>
        <button type={"button"} onClick={setShowAll.bind(this, !showAll)}>
          {showAll ? "show important" : "show all"}
        </button>
      </form>
    </div>
  );
}

export default App;
