import "./App.css";
import { Note } from "./components/note";

function App({ notes }) {
  return (
    <div className="App">
      <h1>Note</h1>
      <ul>
        {notes.map((note) => (
          <Note content={note.content} key={note.id} />
        ))}
      </ul>
    </div>
  );
}

export default App;
