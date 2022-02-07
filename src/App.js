import "./App.css";
import Note from "./components/note";
import { useEffect, useRef, useState } from "react";
import noteServices from "./services/note";
import loginServices from "./services/login";
import Notification from "./components/notification";
import LoginForm from "./components/loginForm";
import Togglable from "./components/togglable";
import NoteForm from "./components/noteForm";

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

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON);
      setUser(loggedUser);
      noteServices.setToken(loggedUser);
    }
  }, []);

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  const addNote = (event) => {
    noteRef.current.toggleVisibility();
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
      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));
      setUser(user);
      noteServices.setToken(user.token);
      setUsername("");
      setPassword("");
    } catch (expection) {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const loginForm = () => {
    return (
      <Togglable buttonLabel={"login"}>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={(event) => setUsername(event.target.value)}
          handlePasswordChange={(event) => setPassword(event.target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
    );
  };

  const noteRef = useRef();

  const noteForm = () => (
    <Togglable buttonLabel={"new note"} ref={noteRef}>
      <NoteForm onSubmit={addNote} value={newNote} onChange={handleOnChange} />
    </Togglable>
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
          {noteForm()}
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
