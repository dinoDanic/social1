export const initialState = {
  user_login: false,
  userData: {},
  user_username: "Buča",
  user_userId: "",
  user_profileImage: "https://picsum.photos/200",
  createPost: false,
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
    case "SET_CREATEPOST":
      return {
        ...state,
        createPost: action.createPost,
      };
    case "SET_AVATARPHOTO":
      return {
        ...state,
        user_profileImage: action.user_profileImage,
      };
    case "SET_USER_ID":
      return {
        ...state,
        user_userId: action.user_userId,
      };
    default:
      return state;
  }
};

export default reducer;
