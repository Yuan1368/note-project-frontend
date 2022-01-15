import "./App.css";
import { Note } from "./components/note";
import { useEffect, useState } from "react";
import { http } from "./utils/http";
import { Notification } from "./components/notification";

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("new Note");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState("some errors happened...");

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
      })
      .catch((error) => {
        setErrorMessage(`${error} error removed...`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 1000);
        setNotes(notes.filter((note) => note.id !== id));
      });
  };

  const removeNote = (id) => {
    http.deleteNote(id).then((res) => {
      setNotes([...notes.filter((note) => note.id !== id)]);
    });
  };

  return (
    <div className="app">
      <h1 className={"app__title"}>Note</h1>
      <Notification message={errorMessage} />
      <form>
        <input value={newNote} onChange={handleOnChange} />
        <button type={"submit"} onClick={addNote}>
          save
        </button>
      </form>
      <ul>
        {notesToShow.map((note) => (
          <Note
            content={note.content}
            onUpdateClick={() => taggleNoteImportant(note.id)}
            onDeleteClick={() => removeNote(note.id)}
            key={note.id}
          />
        ))}
      </ul>
      <button type={"button"} onClick={setShowAll.bind(this, !showAll)}>
        {showAll ? "show important" : "show all"}
      </button>
    </div>
  );
}

export default App;
