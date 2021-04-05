import { motion } from "framer-motion";
import { db } from "../lib/firebase";
import { Avatar, Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { pageVariants } from "../functions/pageVariants";
import { useDataLayerValue } from "../DataLayer";
import "../styles/Acc.scss";

function Acc() {
  const [
    { user_username, user_profileImage, userData, user_userId },
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
    setValueBtn(false);
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
      <div className="acc_h1"></div>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="acc__avatar">
          <div className="acc__setImage">
            {/* <h3>{user_username}</h3> */}
            <Avatar
              src={user_profileImage}
              onClick={() => setAvatarImage(!avatarImage)}
            />
            {/* <Button
              onClick={() => setAvatarImage(!avatarImage)}
              variant="outlined"
              color="primary"
            >
              Set Image
            </Button> */}
          </div>
        </div>

        <div className="acc__userinfo">
          <div className="acc__username">
            <h3>Username</h3>
            {valueBtn ? (
              <input
                placeholder={user_username}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            ) : (
              <p>{user_username}</p>
            )}
          </div>
          <div className="acc__email">
            <h3>Email</h3>
            <p>{userData.user.email}</p>
          </div>
          <div className="acc__userPhoto">
            <h3>User Photo</h3>
            {valueBtn ? (
              <input
                placeholder={user_profileImage}
                onChange={(e) => setAvatarImageUrl(e.target.value)}
              />
            ) : (
              <p>{user_profileImage}</p>
            )}
          </div>
          <div className="acc__userId">
            <h3>User ID</h3>
            <p>{user_userId}</p>
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
          <Button variant="contained" onClick={() => setValueBtn(!valueBtn)}>
            Edit
          </Button>
        )}
      </form>
    </motion.div>
  );
}

export default Acc;
