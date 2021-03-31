import React, { useEffect, useState, useRef } from "react";
import { Firebase, db } from "../lib/firebase";
import "../styles/SignAndLogin.scss";
import { useDataLayerValue } from "../DataLayer";
import dino1Img from "../img/dino1.png";
import bubbleImg from "../img/bubble.png";
import { motion } from "framer-motion";

function Login() {
  const [, dispatch] = useDataLayerValue();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");
  const [boxPosition, setBoxPosition] = useState("0%");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerProfileImage, setRegisterProfileImage] = useState("");
  const [initials, setInitials] = useState(false);
  const [registerIinitials, setRegisterInitials] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();

  const loginHandler = (e) => {
    e.preventDefault();
    Firebase.auth()
      .signInWithEmailAndPassword(loginEmail, loginPassword)
      .then((userData) => {
        dispatch({
          type: "SET_USER_DATA",
          userData: userData,
        });
        dispatch({
          type: "SET_USER_LOGIN",
          user_login: true,
        });
        dispatch({
          type: "SET_USER_ID",
          user_userId: userData.user.uid,
        });
        db.collection("users")
          .doc(userData.user.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              dispatch({
                type: "SET_AVATARPHOTO",
                user_profileImage: doc.data().avatar,
              });
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

  const registerHandler = (e) => {
    e.preventDefault();
    Firebase.auth()
      .createUserWithEmailAndPassword(registerEmail, registerPassword)
      .then((userData) => {
        db.collection("users").doc(userData.user.uid).set({
          username: registerUsername,
          email: registerEmail,
          password: registerPassword,
          avatar: registerProfileImage,
          userId: userData.user.uid,
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
          user_username: registerUsername,
        });
        dispatch({
          type: "SET_USER_ID",
          user_userId: userData.user.uid,
        });
        dispatch({
          type: "SET_AVATARPHOTO",
          user_profileImage: registerProfileImage,
        });
      })
      .catch((error) => {
        var errorCode = error.code;
        console.log(errorCode);
        setError(errorCode);
        // ..
      });
  };
  const demoLogin = () => {
    emailRef.current.value = "dino@demo.com";
    passwordRef.current.value = "111111";
    setLoginEmail("dino@demo.com");
    setLoginPassword("111111");
  };
  useEffect(() => {
    if (loginEmail && loginPassword) {
      setInitials(true);
    } else {
      setInitials(false);
    }
  }, [loginEmail, loginPassword]);
  useEffect(() => {
    if (registerUsername && registerEmail && registerPassword) {
      setRegisterInitials(true);
    } else {
      setRegisterInitials(false);
    }
  }, [registerUsername, registerEmail, registerPassword]);
  return (
    <div className="login">
      <div className="login__box">
        <div className="login__inside">
          <motion.div
            className="login__wraper"
            animate={{ y: boxPosition }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <h1>Login</h1>
            <p onClick={() => demoLogin()}>demo login</p>

            <form autoComplete="on">
              <input
                ref={emailRef}
                type="text"
                id="email"
                name="email"
                placeholder="Email"
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <input
                ref={passwordRef}
                type="password"
                placeholder="Password"
                id="password"
                name="password"
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              {initials ? (
                <motion.button
                  whileHover={{ scale: 0.97 }}
                  whileTap={{ scale: 0.94 }}
                  type="submit"
                  id="3"
                  onClick={loginHandler}
                >
                  Login
                </motion.button>
              ) : (
                <button
                  onClick={(e) => e.preventDefault()}
                  className="login__failBtn"
                >
                  Login
                </button>
              )}
            </form>
            <p className="login__error">{error}</p>
            <div
              className="login__noAcc"
              onClick={() => setBoxPosition("-100%")}
            >
              <p>
                No Account?
                <br />
                <strong>Register!</strong>
              </p>
            </div>
          </motion.div>
          <motion.div
            className="login__wraper"
            animate={{ y: boxPosition }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <h1>Register</h1>
            <form>
              <input
                type="text"
                placeholder="Username"
                onChange={(e) => setRegisterUsername(e.target.value)}
              />
              <input
                type="text"
                placeholder="Email"
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
              <input
                type="text"
                placeholder="Profile Image URL (optional)"
                onChange={(e) => setRegisterProfileImage(e.target.value)}
              />
              {registerIinitials ? (
                <motion.button
                  whileHover={{ scale: 0.97 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={registerHandler}
                >
                  Register
                </motion.button>
              ) : (
                <button
                  onClick={(e) => e.preventDefault()}
                  className="login__failBtn"
                >
                  Register
                </button>
              )}
            </form>
            <p className="login__error">{error}</p>
            <div className="login__noAcc" onClick={() => setBoxPosition("0%")}>
              <p>
                Have Account?
                <br />
                <strong>Login!</strong>
              </p>
            </div>
          </motion.div>
        </div>
        <div className="login__dino">
          <img src={dino1Img} alt="" />
        </div>
        <div className="login__bubble">
          <img src={bubbleImg} alt="" />
        </div>
      </div>
    </div>
  );
}

export default Login;
