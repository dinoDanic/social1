import React, { useState } from "react";
import { Firebase, db } from "../lib/firebase";

import "../styles/SignAndLogin.scss";
import { useDataLayerValue } from "../DataLayer";
import { TextField } from "@material-ui/core";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

function SignUp({ setAppUserSignUp }) {
  const [{}, dispatch] = useDataLayerValue();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const signUpHandler = (e) => {
    e.preventDefault();
    Firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userData) => {
        db.collection("users").doc(userData.user.uid).set({
          username: username,
        });
        dispatch({
          type: "SET_USER_DATA",
          userData: userData,
        });
        dispatch({
          type: "SET_USER_LOGIN",
          user_login: true,
        });
        dispatch({
          type: "SET_USER_USERNAME",
          user_username: username,
        });
      })
      .catch((error) => {
        var errorCode = error.code;
        console.log(errorCode);
        setError(errorCode);
        // ..
      });
  };

  return (
    <div className="signUp">
      <form autoComplete="off">
        <HighlightOffIcon
          className="signUp__close"
          onClick={() => setAppUserSignUp(false)}
        />
        <h3>Sign up</h3>

        <p>{error}</p>
        <TextField
          id="outlined-basic"
          label="Username"
          onChange={(e) => setUsername(e.target.value)}
          type="text"
        />
        <TextField
          id="outlined-basic"
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <TextField
          id="outlined-basic"
          label="password"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <button onClick={signUpHandler}>Sign up</button>

        <p></p>
      </form>
    </div>
  );
}

export default SignUp;
