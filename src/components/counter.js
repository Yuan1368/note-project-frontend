import React from "react";
import { store } from "../store/counter";

const Counter = () => {
  return (
    <div>
      <p>Counter</p>
      <div>{store.getState()}</div>
      <button onClick={() => store.dispatch({ type: "INCREMENT" })}>+1</button>
      <button onClick={() => store.dispatch({ type: "DECREMENT" })}>-1</button>
      <button onClick={() => store.dispatch({ type: "ZERO" })}>reset</button>
    </div>
  );
};

export default Counter;
