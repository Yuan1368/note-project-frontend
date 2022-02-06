import "./App.css";
import { Note } from "./components/note";
import { useEffect, useState } from "react";
import noteServices from "./services/note";
import loginServices from "./services/login";
import { Notification } from "./components/notification";

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("new Note");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState("some errors happened...");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    noteServices.getAllNotes().then((res) => setNotes(res));
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

    noteServices.postNotes(noteObject).then((res) => {
      setNotes([...notes, res]);
      setNewNote("");
    });
  };

  const handleOnChange = (event) => {
    setNewNote(event.target.value);
  };

  const taggleNoteImportant = (id) => {
    let _note = notes.find((note) => note.id === id);

    noteServices
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
    noteServices.deleteNote(id).then((res) => {
      setNotes([...notes.filter((note) => note.id !== id)]);
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginServices.login({
        username,
        password,
      });
      setUser(user);
      console.log(user);
      setUsername("");
      setPassword("");
    } catch (expection) {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const loginForm = () => (
    <form>
      <div>
        username
        <input
          type={"text"}
          value={username}
          name="Username"
          onChange={({ target }) => {
            setUsername(target.value);
          }}
        />
      </div>
      <div>
        password
        <input
          type={"password"}
          value={password}
          name={"Password"}
          onChange={({ target }) => {
            setPassword(target.value);
          }}
        />
      </div>
      <button type={"submit"} onClick={(event) => handleLogin(event)}>
        login
      </button>
    </form>
  );

  const noteForm = () => (
    <form>
      <input value={newNote} onChange={handleOnChange} />
      <button type={"submit"} onClick={addNote}>
        save
      </button>
    </form>
  );

  return (
    <div className="app">
      <h1 className={"app__title"}>Note</h1>
      <Notification message={errorMessage} />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>{user.name} logined-in</p>
          noteForm()
        </div>
      )}
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
