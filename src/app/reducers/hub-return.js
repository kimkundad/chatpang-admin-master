const initialState = {
  dataRlEx: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DATA_RL_EX':
      return {
        ...state,
        dataRlEx: action.dataRlEx,
      };
    default:
      return state;
  }
};

export default reducer;
