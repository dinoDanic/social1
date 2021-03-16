import React, { useState, useRef } from "react";
import { Avatar } from "@material-ui/core";
import "../styles/AddComment.scss";
import { db } from "../lib/firebase";
import { useDataLayerValue } from "../DataLayer";

function AddComment({ id }) {
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
  };
  return (
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
  );
}

export default AddComment;
