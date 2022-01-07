export const Note = ({ content, onClick }) => {
  return (
    <div>
      <li>{content}</li>
      <button onClick={onClick}>chang important</button>
    </div>
  );
};
