const NoteForm = ({ onSubmit, handleChange, value }) => {
  return (
    <div>
      <h2>Create a new note</h2>

      <form>
        <input value={value} onChange={handleChange} />
        <button type="submit" onClick={onSubmit}>
          save
        </button>
      </form>
    </div>
  );
};

export default NoteForm;
