const noteReducer = (state = [], action) => {
  switch (action.type) {
    case "NEW_NOTE": {
      state.push(action.data);
      return state;
    }
    default:
      return state;
  }
};
