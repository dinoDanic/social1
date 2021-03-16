export const initialState = {
  user_login: false,
  userData: {},
  user_username: "unknown",
  user_profileImage: "",
};

const reducer = (state, action) => {
  console.log(action);

  switch (action.type) {
    case "SET_USER_DATA":
      return {
        ...state,
        userData: action.userData,
      };
    case "SET_USER_LOGIN":
      return {
        ...state,
        user_login: action.user_login,
      };
    case "SET_USER_USERNAME":
      return {
        ...state,
        user_username: action.user_username,
      };
    default:
      return state;
  }
};

export default reducer;
