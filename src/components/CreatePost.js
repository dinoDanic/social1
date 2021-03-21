import { Avatar } from "@material-ui/core";
import React, { useState } from "react";
import "../styles/CreatePost.scss";
import { db, firebasetime } from "../lib/firebase";
import { useDataLayerValue } from "../DataLayer";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { motion } from "framer-motion";

function CreatePost() {
  const [{ user_username }, dispatch] = useDataLayerValue();
  const [imageLink, setImageLink] = useState("");
  const [onMind, setOnMind] = useState();
  function buttonHandler(e) {
    e.preventDefault();

    db.collection("posts")
      .add({
        postText: onMind,
        username: user_username,
        image: imageLink,
        created: firebasetime,
      })
      .then((docData) => {
        db.collection("posts").doc(docData.id).set(
          {
            id: docData.id,
          },
          { merge: true }
        );
      });
    dispatch({
      type: "SET_CREATEPOST",
      createPost: false,
    });
  }
  return (
    <motion.div
      className="createPost__tata"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="createPost__layer"
        onClick={() =>
          dispatch({
            type: "SET_CREATEPOST",
            createPost: false,
          })
        }
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1, position: "absolute" }}
      ></motion.div>
      <div className="createPost">
        <div className="createPost__form">
          <form>
            <HighlightOffIcon
              className="form__close"
              onClick={() =>
                dispatch({
                  type: "SET_CREATEPOST",
                  createPost: false,
                })
              }
            />
            <div className="form__name">
              <Avatar /> <h3>{user_username}</h3>
            </div>
            <input
              type="text"
              placeholder="Whats on ur mind?"
              onChange={(e) => setOnMind(e.target.value)}
            />
            <input
              type="text"
              placeholder="Image link"
              onChange={(e) => setImageLink(e.target.value)}
            />
            <button
              onClick={buttonHandler}
              variant="contained"
              color="primary"
              size="small"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

export default CreatePost;
