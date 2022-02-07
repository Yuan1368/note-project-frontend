import React from "react";

const loginForm = ({
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
  handleSubmit,
}) => {
  return (
    <div>
      <h2>Login</h2>
      <form>
        <div>
          username
          <input value={username} onChange={handleUsernameChange} />
        </div>
        <div>
          password
          <input
            value={password}
            onChange={handlePasswordChange}
            type={"password"}
          />
        </div>
        <button type={"submit"} onClick={handleSubmit}>
          login
        </button>
      </form>
    </div>
  );
};

export default loginForm;
