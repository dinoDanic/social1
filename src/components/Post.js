import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { AnimatePresence, motion } from "framer-motion";
import "../styles/Post.scss";
import { Avatar } from "@material-ui/core";
import { useDataLayerValue } from "../DataLayer";
import CommentOutlinedIcon from "@material-ui/icons/CommentOutlined";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import BigPost from "./BigPost";
import { useLocation } from "react-router-dom";

function Post({
  postText,
  image,
  postId,
  userId,
  userAvatar,
  username,
  imageDb,
}) {
  const [
    { user_username, user_userId, currentPostOpenId },
  ] = useDataLayerValue();
  const [commentList, setCommentList] = useState([]);
  const [commentNumber, setCommentNumber] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [likeList, setLikeList] = useState([]);
  const [colorLike, setColorLike] = useState("");
  const [trueUser, setTrueUser] = useState(false);
  const location = useLocation();
  const pathId = location.pathname.split("/")[2];

  const toggleOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (currentPostOpenId === postId) {
      setIsOpen(true);
    }
  }, [currentPostOpenId, postId]);
  useEffect(() => {
    if (isOpen && postId) {
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
    const commentCount = () => {
      if (postId) {
        db.collection("posts")
          .doc(postId)
          .collection("comments")
          .onSnapshot((data) => {
            setCommentNumber(data.size);
          });
      }
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
    commentCount();
    checkLike();
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
      <motion.div
        layoutId={postId}
        onClick={toggleOpen}
        className="post"
        transition={{ duration: 0 }}

        /*     whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }} */
      >
        <motion.div
          className="post__user"
          layoutId={`postUser ${postId}`}
          transition={{ duration: 0 }}
        >
          <Avatar className="post__avatar" src={userAvatar} />
          <div className="post__userName">
            <h3>{username}</h3>
          </div>
        </motion.div>
        <div className="post__content">
          {imageDb && (
            <div className="post__image">
              <motion.img
                layoutId={`image ${postId}`}
                src={imageDb}
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
        <motion.div
          className="post__controls"
          /* layoutId={`postControl ${postId}`} */
        >
          <div className="post__controls--likes">
            <InsertEmoticonIcon fontSize="small" style={{ color: colorLike }} />
            <p>{likeList.length}</p>
          </div>
          <div className="post__controls--comments">
            <CommentOutlinedIcon fontSize="small" />
            <p>{commentNumber}</p>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <BigPost
            pathId={pathId}
            userId={userId}
            likeList={likeList}
            username={username}
            userAvatar={userAvatar}
            postId={postId}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            image={image}
            imageDb={imageDb}
            postText={postText}
            commentList={commentList}
            trueUser={trueUser}
            currentPostOpenId={currentPostOpenId}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Post;
