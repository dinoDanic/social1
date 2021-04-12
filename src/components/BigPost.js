import React, { useEffect, useRef, useState } from "react";
import { db, firebasetime } from "../lib/firebase";
import { motion } from "framer-motion";
import "../styles/BigPost.scss";
import { Avatar } from "@material-ui/core";
import { useDataLayerValue } from "../DataLayer";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import { Link } from "react-router-dom";
import MiniMenu from "../components/MiniMenu";
import CloseIcon from "@material-ui/icons/Close";
function BigPost({
  postId,
  setIsOpen,
  isOpen,
  image,
  userAvatar,
  username,
  postText,
  commentList,
  likeList,
  userId,
  trueUser,
  currentPostOpenId,
}) {
  const [
    { user_username, user_profileImage, user_userId },
    dispatch,
  ] = useDataLayerValue();
  const [addComment, setAddComment] = useState("");
  const [colorLike, setColorLike] = useState("");
  const bottom = useRef();
  const inputComment = useRef();
  const commentHanlder = (e) => {
    e.preventDefault();
    if (addComment) {
      db.collection("posts").doc(postId).collection("comments").add({
        comment: addComment,
        from: user_username,
        postId: postId,
        created: firebasetime,
      });
      inputComment.current.value = "";
      setAddComment("");
    }
  };
  const likeHandler = () => {
    if (likeList.includes(user_username)) {
      db.collection("posts")
        .doc(postId)
        .collection("likes")
        .where("likes", "==", user_username)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            doc.ref.delete();
          });
        });
    } else {
      db.collection("posts").doc(postId).collection("likes").doc().set(
        {
          likes: user_username,
        },
        { merge: true }
      );
      db.collection("not_likes")
        .doc()
        .set({
          likedPostId: postId,
          likedFrom: user_username,
          likedFromId: user_userId,
          likedToId: userId,
          customKey: Math.round(Math.random() * 1000000),
          read: false,
        });
    }
  };

  useEffect(() => {
    if (likeList.includes(user_username)) {
      setColorLike("#6f87ff");
    } else {
      setColorLike("gray");
    }
  }, [likeList, user_username]);

  const layerHandler = () => {
    setIsOpen(!isOpen);
    console.log(currentPostOpenId, postId);
    if (currentPostOpenId === postId) {
      setTimeout(() => {
        dispatch({
          type: "SET_CURRENT_POSTID",
          currentPostOpenId: "",
        });
      }, 500);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      bottom.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 300);
  }, [isOpen]);
  return (
    <>
      <div onClick={() => layerHandler()} className="bigPost__layer"></div>
      <motion.div className="bigPost" layoutId={postId}>
        <div className="bigPost__topControls">
          <motion.div
            className="bigPost__likes"
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
          {trueUser && <MiniMenu postId={postId} />}
        </div>
        <div className="bigPost__content">
          {image && (
            <div className="bigPost__image">
              <motion.img layoutId={`image ${postId}`} src={image} alt="" />
            </div>
          )}
          <div className="bigPost__post">
            <motion.div
              className="bigPost__user"
              layoutId={`postUser ${postId}`}
            >
              <Avatar className="bigPost__avatar" src={userAvatar} />
              <Link to={`/user/${userId}`}>
                <h3>{username}</h3>
              </Link>
            </motion.div>
            <div className="bigPost__postContent">
              <motion.p layoutId={`postText ${postId}`}>{postText}</motion.p>
            </div>
          </div>
        </div>
        <div className="bigPost__info">
          <div className="bigPost__info--comment">
            <p>
              <strong>Comments:</strong> {commentList.length}
            </p>
          </div>
          <div className="bigPost__info--likes">
            <p>
              <strong>Likes: </strong>
              {likeList.length}
            </p>
          </div>
          <div className="bigPost__info--likesFrom">
            <p>
              <strong>by: </strong>
            </p>
            <div className="bigPost__likeList">
              {likeList?.map((data) => {
                return <p>{data}</p>;
              })}
            </div>
          </div>
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
          <div className="bigPost__addComment">
            <Avatar fontSize="small" src={user_profileImage} />
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
          <div className="bigPost__bottom" ref={bottom}></div>
        </div>
        <div className="bigPost__close">
          <CloseIcon onClick={() => setIsOpen(!isOpen)} />
        </div>
      </motion.div>
    </>
  );
}

export default BigPost;
