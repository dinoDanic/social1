import React, { useEffect, useState } from "react";
import "../styles/Posts.scss";
import { db } from "../lib/firebase";
import Post from "./Post";

function Posts() {
  const [postList, setPostList] = useState([]);

  useEffect(() => {
    db.collection("posts").onSnapshot((data) => {
      var list = [];
      data.docs.forEach((doc) => {
        list.push(doc.data());
      });
      setPostList(list);
    });
  }, []);
  return (
    <div className="posts">
      {postList && (
        <div className="posts__post">
          {postList.map((data) => {
            console.log(data);
            return (
              <Post
                id={data.id}
                key={Math.random()}
                postText={data.postText}
                username={data.username}
                image={data.image}
                comments={data.comments}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Posts;
