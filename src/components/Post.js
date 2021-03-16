import React, { useEffect, useState, useRef } from "react";
import { db, Firebase } from "../lib/firebase";
import "../styles/Post.scss";
import { Avatar } from "@material-ui/core";
/* import CommentIcon from "@material-ui/icons/Comment"; */
import AddComment from "../components/AddComment";
import { useDataLayerValue } from "../DataLayer";

function Post({ postText, username, image, comments, id }) {
  const [commentList, setCommentList] = useState([]);
  const [{ user_username }, dispatch] = useDataLayerValue();
  const [addComment, setAddComment] = useState("");
  const inputComment = useRef();
  const commentHanlder = (e) => {
    e.preventDefault();
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
  return (
    <div className="post">
      <div className="post__user">
        <Avatar />
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
      <div className="addComment">
        <div className="addComment">
          <Avatar fontSize="small" />
          <form onSubmit={commentHanlder}>
            <input
              ref={inputComment}
              type="text"
              placeholder="comment"
              onChange={(e) => setAddComment(e.target.value)}
            />
          </form>
        </div>
      </div>
      <div className="post__comments">
        {commentList.map((data) => {
          return (
            <div className="post__com" key={Math.random()}>
              <p>
                <strong>{data.from}</strong>
              </p>
              <p>{data.comment}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Post;
