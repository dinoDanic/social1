import React, { useEffect, useRef, useState } from "react";
import { db, firebasetime, FF } from "../lib/firebase";
import { motion } from "framer-motion";
import "../styles/BigPost.scss";
import { Avatar } from "@material-ui/core";
import { useDataLayerValue } from "../DataLayer";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import { Link } from "react-router-dom";
import MiniMenu from "../components/MiniMenu";
function BigPost({
  postId,
  setIsOpen,
  isOpen,
  image,
  userAvatar,
  userName,
  postText,
  commentList,
  likeList,
  userId,
  trueUser,
}) {
  const [{ user_username, user_profileImage }] = useDataLayerValue();
  const [addComment, setAddComment] = useState("");
  const [colorLike, setColorLike] = useState("");
  console.log("HITTING BIG POST");
  const inputComment = useRef();
  const commentHanlder = (e) => {
    e.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      comment: addComment,
      from: user_username,
      postId: postId,
      created: firebasetime,
    });
    inputComment.current.value = "";
    setAddComment("");
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
      /* db.collection("posts")
        .doc(postId)
        .set(
          {
            likes: FF.FieldValue.arrayRemove(user_username),
          },
          { merge: true }
        ); */
    } else {
      db.collection("posts").doc(postId).collection("likes").doc().set(
        {
          likes: user_username,
        },
        { merge: true }
      );
      /*       setOneLike(); */
    }
  };
  /*  const setOneLike = () => {
    db.collection("posts").doc(postId).set(
      {
        likes: FF,
      },
      { merge: true }
    );
  }; */
  useEffect(() => {
    if (likeList.includes(user_username)) {
      setColorLike("#6f87ff");
    } else {
      setColorLike("gray");
    }
  }, [likeList, user_username]);
  return (
    <>
      <div onClick={() => setIsOpen(!isOpen)} className="bigPost__layer"></div>
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
                <h3>{userName}</h3>
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
        </div>
      </motion.div>
    </>
  );
}

export default BigPost;
