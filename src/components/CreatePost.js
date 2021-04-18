import React, { useEffect, useState } from "react";
import { Avatar, Button, TextField } from "@material-ui/core";
import "../styles/CreatePost.scss";
import { db, firebasetime, Firebase } from "../lib/firebase";
import { useDataLayerValue } from "../DataLayer";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { motion } from "framer-motion";
import ImageIcon from "@material-ui/icons/Image";

function CreatePost() {
  const [
    { user_username, userData, user_profileImage },
    dispatch,
  ] = useDataLayerValue();
  const [onMind, setOnMind] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [buttonValid, setButtonValid] = useState(false);
  const [uploadingStatus, setUploadingStatus] = useState(false);

  function buttonHandler(e) {
    e.preventDefault();

    db.collection("posts")
      .add({
        postText: onMind,
        username: user_username,
        created: firebasetime,
        imageDb: fileUrl,
      })
      .then((docData) => {
        db.collection("posts").doc(docData.id).set(
          {
            postId: docData.id,
            userId: userData.user.uid,
            avatar: user_profileImage,
          },
          { merge: true }
        );
      });
    dispatch({
      type: "SET_CREATEPOST",
      createPost: false,
    });
  }

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    const storageRef = Firebase.storage().ref();
    const fileRef = storageRef.child(file.name);
    setButtonValid(false);
    setUploadingStatus(true);
    await fileRef.put(file);
    setButtonValid(true);
    setUploadingStatus(false);
    console.log("loading ends");
    setFileUrl(await fileRef.getDownloadURL());
    await console.log("upload complete", file);
  };

  useEffect(() => {
    if (onMind.length > 0) {
      setButtonValid(true);
    }
    if (onMind.length <= 0) {
      setButtonValid(false);
    }
  }, [onMind]);

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
          {uploadingStatus && (
            <div className="createPost__uploading">
              <motion.div
                className="createPost__boxLoading"
                animate={{ rotate: 500 }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  repeatType: "reverse",
                }}
              ></motion.div>
            </div>
          )}
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
            <TextField
              type="text"
              label="Whats on ur mind?"
              variant="outlined"
              onChange={(e) => setOnMind(e.target.value)}
            />
            <div className="createPost__gotImage">
              <ImageIcon fontSize="large" />
              <input
                className="createPost__inputFile"
                type="file"
                onChange={onFileChange}
              />
            </div>
            {buttonValid ? (
              <Button
                onClick={buttonHandler}
                variant="contained"
                color="primary"
                size="small"
              >
                Post
              </Button>
            ) : (
              <Button
                className="createPost__buttonNotValid"
                onClick={(e) => e.preventDefault()}
              >
                post
              </Button>
            )}
          </form>
        </div>
      </div>
    </motion.div>
  );
}

export default CreatePost;
