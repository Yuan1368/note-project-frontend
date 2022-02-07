import React from "react";
import PropTypes from "prop-types";

const LoginForm = ({
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

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};

export default LoginForm;
