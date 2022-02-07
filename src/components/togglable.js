import React, { useImperativeHandle, useState } from "react";
import PropTypes from "prop-types";

const Togglable = React.forwardRef((props, ref) => {
  const [visibility, setVisibility] = useState(false);
  const hiddenVisible = { display: visibility ? "none" : "" };
  const showVisible = { display: visibility ? "" : "none" };

  const togglableVisibility = () => {
    setVisibility(!visibility);
  };

  useImperativeHandle(ref, () => {
    return togglableVisibility;
  });

  return (
    <div>
      <div style={hiddenVisible}>
        <button onClick={togglableVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showVisible}>
        {props.children}
        <button onClick={togglableVisibility}>cancel</button>
      </div>
    </div>
  );
});

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

Togglable.displayName = "Togglable";

export default Togglable;
