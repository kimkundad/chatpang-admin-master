const initialState = {
  access_token: '',
  username: '',
  userID: '',
  picture: '',
  first_name: '',
  last_name: '',
  tel: '',
  status: '',
  role: '',
  auth: false,
  verifyLoading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        access_token: action.access_token,
        username: action.username,
        userID: action.userID,
        picture: action.picture,
        first_name: action.first_name,
        last_name: action.last_name,
        tel: action.tel,
        status: action.status,
        role: action.role,
      };
    case 'LOGOUT':
      return {
        ...state,
        access_token: action.access_token,
        username: action.username,
        userID: action.userID,
        picture: action.picture,
        first_name: action.first_name,
        last_name: action.last_name,
        tel: action.tel,
        status: action.status,
        role: action.role,
      };
    case 'VERIFY':
      return {
        ...state,
        auth: action.auth,
        verifyLoading: action.isLoading,
      };
    default:
      return state;
  }
};

export default reducer;
