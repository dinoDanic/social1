import React, { useEffect, useState, useRef } from "react";
import { db, Firebase } from "../lib/firebase";
import { AnimatePresence, motion } from "framer-motion";
import "../styles/Post.scss";
import { Avatar } from "@material-ui/core";
/* import CommentIcon from "@material-ui/icons/Comment"; */
import { useDataLayerValue } from "../DataLayer";
import { act } from "react-dom/test-utils";

function Post({ postText, username, image, comments, id }) {
  const [commentList, setCommentList] = useState([]);
  const [{ user_username }, dispatch] = useDataLayerValue();
  const [addComment, setAddComment] = useState("");
  const [postComment, setPostComment] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputComment = useRef();
  const toggleOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (isOpen) {
      getComments();
      console.log("getting comments", db);
    }
  }, [isOpen]);

  const commentHanlder = (e) => {
    e.preventDefault();
    let time = new Date();
    let timeHours = time.getHours();
    let timeMinutes = time.getMinutes();
    let timeHM = `${timeHours}${timeMinutes}`;

    db.collection("comments").doc().set({
      comment: addComment,
      from: user_username,
      id: id,
    });
    inputComment.current.value = "";
    setAddComment("");
    getComments();
  };
  const getComments = () => {
    db.collection("comments")
      .where("id", "==", id)
      .get()
      .then((querySnapshot) => {
        var list = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          list.push(doc.data());
        });
        setCommentList(list);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };
  const post__animation = {
    hidden: {},
    active: {
      width: "80%",
      height: "100%",
      zIndex: "100",
      transition: {
        duration: 0.5,
      },
    },
  };
  return (
    <>
      <motion.div
        layoutId={id}
        onClick={toggleOpen}
        className="post"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="post__user">
          <Avatar className="post__avatar" />
          <h3>{username}</h3>
        </div>

        {image && (
          <div className="post__image">
            <img src={image} alt="" />
          </div>
        )}
        <div className="post__text">
          <p>{postText}</p>
        </div>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="bigPost__layer"
            ></div>
            <motion.div className="bigPost" layoutId={id}>
              <div className="post__user">
                <Avatar className="post__avatar" />
                <h3>{username}</h3>
              </div>
              {image && (
                <div className="bigPost__image">
                  <img src={image} alt="" />
                </div>
              )}
              <p>{postText}</p>
              <div className="post__comments">
                {commentList?.map((data) => {
                  return (
                    <div className="post__com" key={Math.random()}>
                      <p>
                        <strong>{data.from}</strong>
                      </p>
                      <p>- {data.comment}</p>
                    </div>
                  );
                })}
              </div>
              <div className="post__addComment">
                <Avatar fontSize="small" />
                <form>
                  <input
                    ref={inputComment}
                    type="text"
                    placeholder="comment"
                    onChange={(e) => setAddComment(e.target.value)}
                  />
                  <button onClick={commentHanlder}></button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Post;
