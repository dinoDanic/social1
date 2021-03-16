import React, { useState } from "react";
import { Firebase, db } from "../lib/firebase";

import "../styles/SignAndLogin.scss";
import { Button, TextField } from "@material-ui/core";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { useDataLayerValue } from "../DataLayer";

function Login({ setAppUserLogin }) {
  const [{}, dispatch] = useDataLayerValue();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginHandler = (e) => {
    e.preventDefault();
    Firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then((userData) => {
        dispatch({
          type: "SET_USER_DATA",
          userData: userData,
        });
        dispatch({
          type: "SET_USER_LOGIN",
          user_login: true,
        });
        db.collection("users")
          .doc(userData.user.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              dispatch({
                type: "SET_USER_USERNAME",
                user_username: doc.data().username,
              });
            } else {
              console.log("No such document!");
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
      })
      .catch((error) => {
        console.log(error.code, error.message);
        setError(error.message);
      });
  };

  return (
    <div className="login">
      <form autoComplete="off">
        <HighlightOffIcon
          className="signUp__close"
          onClick={() => setAppUserLogin(false)}
        />
        <h3>Login</h3>
        <p>{error}</p>
        <TextField
          id="outlined-basic"
          label="Email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="outlined-basic"
          label="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={loginHandler}>Login</button>
      </form>
    </div>
  );
}

export default Login;
