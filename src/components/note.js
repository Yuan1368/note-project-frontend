export const Note = ({ content, onClick }) => {
  return (
    <div>
      <li>
        {content}
        <button onClick={onClick}>chang important</button>
      </li>
    </div>
  );
};
