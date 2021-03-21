import React, { useEffect, useState, useRef } from "react";
import { db, firebasetime } from "../lib/firebase";
import { AnimatePresence, motion } from "framer-motion";
import "../styles/Post.scss";
import { Avatar } from "@material-ui/core";
import { useDataLayerValue } from "../DataLayer";
import CommentOutlinedIcon from "@material-ui/icons/CommentOutlined";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";

function Post({ postText, username, image, id }) {
  const [{ user_username }, dispatch] = useDataLayerValue();
  const [commentList, setCommentList] = useState([]);
  const [commentNumber, setCommentNumber] = useState(0);
  const [addComment, setAddComment] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [likeList, setLikeList] = useState([]);
  const [colorLike, setColorLike] = useState("");
  const inputComment = useRef();

  const toggleOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (isOpen) {
      getComments();
    }
  }, [isOpen]);
  useEffect(() => {
    commentCount();
    checkLike();
  }, []);
  useEffect(() => {
    if (likeList.includes(user_username)) {
      setColorLike("#6f87ff");
    } else {
      setColorLike("gray");
    }
  }, [likeList]);

  const commentHanlder = (e) => {
    e.preventDefault();
    db.collection("posts").doc(id).collection("comments").add({
      comment: addComment,
      from: user_username,
      id: id,
      created: firebasetime,
    });
    inputComment.current.value = "";
    setAddComment("");
  };

  const commentCount = () => {
    db.collection("posts")
      .doc(id)
      .collection("comments")
      .onSnapshot((data) => {
        setCommentNumber(data.size);
      });
  };

  const getComments = () => {
    db.collection("posts")
      .doc(id)
      .collection("comments")
      .orderBy("created", "asc")
      .onSnapshot((data) => {
        var list = [];
        data.docs.forEach((doc) => {
          list.push(doc.data());
        });
        setCommentList(list);
      });
  };
  const checkLike = () => {
    db.collection("posts")
      .doc(id)
      .collection("likes")
      .onSnapshot((data) => {
        let likeListPush = [];
        data.forEach((doc) => {
          likeListPush.push(doc.data().likes);
        });
        setLikeList(likeListPush);
      });
  };

  const likeHandler = () => {
    if (likeList.includes(user_username)) {
      db.collection("posts")
        .doc(id)
        .collection("likes")
        .where("likes", "==", user_username)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            doc.ref.delete();
          });
        });
    } else {
      db.collection("posts").doc(id).collection("likes").doc().set(
        {
          likes: user_username,
        },
        { merge: true }
      );
    }
  };

  return (
    <>
      <motion.div
        layoutId={id}
        onClick={toggleOpen}
        className="post"
        transition={{ duration: 0 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
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
          <div className="post__controls--likes">
            <InsertEmoticonIcon fontSize="small" style={{ color: colorLike }} />
            <p>{likeList.length}</p>
          </div>
          <div className="post__controls--comments">
            <CommentOutlinedIcon fontSize="small" />
            <p>{commentNumber}</p>
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
              <div className="bigPost__header">
                <div className="bigPost__user">
                  <Avatar className="bigPost__avatar" />
                  <h3>{username}</h3>
                </div>
                <motion.div
                  className="bigPost__like"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <InsertEmoticonIcon
                    fontSize="large"
                    className="bigPost__like-button"
                    style={{ color: colorLike }}
                    onClick={() => likeHandler()}
                  />
                </motion.div>
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
