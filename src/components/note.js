const Note = ({ content, onUpdateClick, onDeleteClick }) => {
  return (
    <div>
      <li className={"note"}>
        {content}
        <button onClick={onUpdateClick}>change important</button>
        <button onClick={onDeleteClick}>delete note</button>
      </li>
    </div>
  );
};

export default Note;
