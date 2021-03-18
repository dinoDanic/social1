import React, { useEffect, useState, useRef } from "react";
import { db, firebasetime } from "../lib/firebase";
import { AnimatePresence, motion } from "framer-motion";
import "../styles/Post.scss";
import { Avatar } from "@material-ui/core";
/* import CommentIcon from "@material-ui/icons/Comment"; */
import { useDataLayerValue } from "../DataLayer";
import { act } from "react-dom/test-utils";
import { TimelapseTwoTone } from "@material-ui/icons";
import CommentOutlinedIcon from "@material-ui/icons/CommentOutlined";

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
      console.log("getting comments");
    }
  }, [isOpen]);

  const commentHanlder = (e) => {
    e.preventDefault();

    db.collection("comments").doc().set({
      comment: addComment,
      from: user_username,
      id: id,
      created: firebasetime,
    });
    inputComment.current.value = "";
    setAddComment("");
    getComments();
  };
  const getComments = () => {
    db.collection("comments")
      .where("id", "==", id)
      .orderBy("created", "asc")
      .onSnapshot((data) => {
        var list = [];
        data.docs.forEach((doc) => {
          list.push(doc.data());
        });
        setCommentList(list);
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
        <div className="post__controls">
          <div className="post__controls--comments">
            <CommentOutlinedIcon fontSize="small" />
            <p>10</p>
          </div>
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
              <div className="bigPost__user">
                <Avatar className="bigPost__avatar" />
                <h3>{username}</h3>
              </div>
              {image && (
                <div className="bigPost__image">
                  <img src={image} alt="" />
                </div>
              )}
              <div className="bigPost__content">
                <div className="bigPost__post">
                  <p>{postText}</p>
                </div>
                <div className="bigPost__comments">
                  {commentList?.map((data) => {
                    return (
                      <div className="bigPost__com" key={Math.random()}>
                        <div className="bigPost__comMsg">
                          <p>
                            <strong>{data.from}</strong>
                          </p>
                          <p>{data.comment}</p>
                        </div>
                        <div className="bigPost__comDate"></div>
                      </div>
                    );
                  })}
                </div>
                <div className="bigPost__addComment">
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Post;
