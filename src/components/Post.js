import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { AnimatePresence, motion } from "framer-motion";
import "../styles/Post.scss";
import { Avatar } from "@material-ui/core";
import { useDataLayerValue } from "../DataLayer";
import CommentOutlinedIcon from "@material-ui/icons/CommentOutlined";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import BigPost from "./BigPost";
import { Link, useLocation } from "react-router-dom";

function Post({ postText, image, postId, userId }) {
  const [
    { user_username, user_userId, currentPostOpenId },
  ] = useDataLayerValue();
  const [commentList, setCommentList] = useState([]);
  const [commentNumber, setCommentNumber] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [likeList, setLikeList] = useState([]);
  const [colorLike, setColorLike] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [userName, setUserName] = useState("");
  const [trueUser, setTrueUser] = useState(false);
  const location = useLocation();
  const pathId = location.pathname.split("/")[2];

  const toggleOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (currentPostOpenId === postId) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [pathId, postId]);
  useEffect(() => {
    if (isOpen) {
      const getComments = () => {
        db.collection("posts")
          .doc(postId)
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
      const isThisTrueUser = () => {
        if (postId) {
          db.collection("posts")
            .doc(postId)
            .get()
            .then((data) => {
              if (data.data().userId === user_userId) {
                setTrueUser(true);
              }
            });
        }
      };
      getComments();
      isThisTrueUser();
    }
  }, [isOpen, postId]);

  useEffect(() => {
    if (!userAvatar) {
      const checkUserPhoto = () => {
        if (userId) {
          db.collection("users")
            .where("userId", "==", userId)
            .get()
            .then((data) => {
              data.forEach((doc) => {
                setUserAvatar(doc.data().avatar);
              });
            });
        }
      };
      checkUserPhoto();
    }
  }, [userAvatar, userId]);

  useEffect(() => {
    const commentCount = () => {
      db.collection("posts")
        .doc(postId)
        .collection("comments")
        .onSnapshot((data) => {
          setCommentNumber(data.size);
        });
    };
    const checkLike = () => {
      db.collection("posts")
        .doc(postId)
        .collection("likes")
        .onSnapshot((data) => {
          let likeListPush = [];
          data.forEach((doc) => {
            likeListPush.push(doc.data().likes);
          });
          setLikeList(likeListPush);
        });
    };
    const checkUserName = () => {
      if (userId) {
        db.collection("users")
          .where("userId", "==", userId)
          .get()
          .then((data) => {
            data.forEach((doc) => {
              setUserName(doc.data().username);
            });
          });
      }
    };
    commentCount();
    checkLike();
    checkUserName();
  }, [userId, postId]);

  useEffect(() => {
    if (likeList.includes(user_username)) {
      setColorLike("#6f87ff");
    } else {
      setColorLike("gray");
    }
  }, [likeList, user_username]);

  return (
    <>
      {/*  <Link to={`/post/${postId}`}> */}
      <motion.div
        layoutId={postId}
        onClick={toggleOpen}
        className="post"
        transition={{ duration: 0 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <motion.div
          className="post__user"
          layoutId={`postUser ${postId}`}
          transition={{ duration: 0 }}
        >
          <Avatar className="post__avatar" src={userAvatar} />
          <div className="post__userName">
            <h3>{userName}</h3>
          </div>
        </motion.div>
        <div className="post__content">
          {image && (
            <div className="post__image">
              <motion.img
                layoutId={`image ${postId}`}
                src={image}
                alt=""
                transition={{ duration: 0 }}
              />
            </div>
          )}
          <div className="post__text">
            <motion.p
              layoutId={`postText ${postId}`}
              transition={{ duration: 0 }}
            >
              {postText}
            </motion.p>
          </div>
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
      {/*    </Link> */}

      <AnimatePresence>
        {isOpen && (
          <BigPost
            pathId={pathId}
            userId={userId}
            likeList={likeList}
            userName={userName}
            userAvatar={userAvatar}
            postId={postId}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            image={image}
            postText={postText}
            commentList={commentList}
            trueUser={trueUser}
          />
        )}
      </AnimatePresence>
      {/* <AnimatePresence>
        {isOpen && (
          <>
            <BigPost
              userId={userId}
              likeList={likeList}
              userName={userName}
              userAvatar={userAvatar}
              postId={postId}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              image={image}
              postText={postText}
              commentList={commentList}
              trueUser={trueUser}
            />
          </>
        )}
      </AnimatePresence> */}
    </>
  );
}

export default Post;
