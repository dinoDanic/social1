import { motion } from "framer-motion";
import { db } from "../lib/firebase";
import { Avatar, Button, Input, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { pageVariants } from "../functions/pageVariants";
import { useDataLayerValue } from "../DataLayer";
import "../styles/Acc.scss";

function Acc() {
  const [
    { user_username, user_profileImage, userData },
    dispatch,
  ] = useDataLayerValue();
  const [avatarImage, setAvatarImage] = useState(false);
  const [valueBtn, setValueBtn] = useState(false);
  const [avatarImageUrl, setAvatarImageUrl] = useState("");
  const [newUsername, setNewUsername] = useState("");

  const saveHandler = () => {
    if (avatarImageUrl) {
      db.collection("users").doc(userData.user.uid).set(
        {
          avatar: avatarImageUrl,
        },
        { merge: true }
      );
      dispatch({
        type: "SET_AVATARPHOTO",
        user_profileImage: avatarImageUrl,
      });
    }
    if (newUsername) {
      db.collection("users").doc(userData.user.uid).set(
        {
          username: newUsername,
        },
        { merge: true }
      );
      dispatch({
        type: "SET_USER_USERNAME",
        user_username: newUsername,
      });
    }
  };

  useEffect(() => {
    if (avatarImageUrl || newUsername) {
      setValueBtn(true);
    } else {
      setValueBtn(false);
    }
  }, [avatarImageUrl, newUsername]);
  return (
    <motion.div
      key="2"
      className="acc"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <h1>Account</h1>
        <div className="acc__avatar">
          <h3>{user_username}</h3>
          <div className="acc__setImage">
            <Avatar src={user_profileImage} className="" />
            <Button
              onClick={() => setAvatarImage(!avatarImage)}
              variant="outlined"
              color="primary"
            >
              Set Image
            </Button>
          </div>
          {avatarImage && (
            <div className="acc__inputImg">
              <TextField
                variant="outlined"
                label="Image URL"
                onChange={(e) => setAvatarImageUrl(e.target.value)}
              />
            </div>
          )}
        </div>
        <hr />
        <div className="acc__userinfo">
          <div className="acc__username">
            <h3>Username</h3>
            <TextField
              variant="outlined"
              label={user_username}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </div>
          <div className="acc__email">
            <h3>Email</h3>
            <p>{userData.user.email}</p>
          </div>
        </div>
        {valueBtn ? (
          <Button
            onClick={() => saveHandler()}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        ) : (
          <Button variant="contained" disabled>
            Save
          </Button>
        )}
      </form>
    </motion.div>
  );
}

export default Acc;
