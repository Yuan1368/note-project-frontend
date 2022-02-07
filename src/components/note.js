const Note = ({ content, onUpdateClick, onDeleteClick }) => {
  return (
    <div>
      <li>
        {content}
        <button onClick={onUpdateClick}>chang important</button>
        <button onClick={onDeleteClick}>delete note</button>
      </li>
    </div>
  );
};

export default Note;
