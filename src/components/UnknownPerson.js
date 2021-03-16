import React, { useState } from "react";
import "../styles/UnknownPerson.scss";
import { Avatar, Button } from "@material-ui/core";
import Login from "./Login";
import SignUp from "./SignUp";
import { motion, AnimatePresence } from "framer-motion";

function UnknownPerson() {
  const [appUserLogin, setAppUserLogin] = useState(false);
  const [appUserSignUp, setAppUserSignUp] = useState(false);

  const questionSignUpHandler = () => {
    setAppUserSignUp(true);
  };
  const questionLoginHandler = () => {
    setAppUserLogin(true);
  };

  return (
    <div className="unknownPerson">
      <div className="unknownPerson__user">
        <Avatar className="unknownPerson__avatar" />
        <h1>Hello, unknow person</h1>

        <div className="unknownPerson__loginOrRegsiter">
          <Button
            onClick={() => questionLoginHandler()}
            size="small"
            color="primary"
          >
            Login?
          </Button>{" "}
          <br />
          <Button
            size="small"
            color="primary"
            onClick={() => questionSignUpHandler()}
          >
            Sign up?
          </Button>
        </div>

        <AnimatePresence>
          {appUserSignUp && (
            <motion.div
              className="unknownPerson__form"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <SignUp setAppUserSignUp={setAppUserSignUp} />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {appUserLogin && (
            <motion.div
              className="unknownPerson__form"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <Login setAppUserLogin={setAppUserLogin} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default UnknownPerson;
