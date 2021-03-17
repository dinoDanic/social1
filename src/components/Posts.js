import React, { useEffect, useState } from "react";
import "../styles/Posts.scss";
import { db } from "../lib/firebase";
import Post from "./Post";
import { AnimateSharedLayout } from "framer-motion";

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
        <AnimateSharedLayout>
          <div className="posts__post">
            {postList.map((data) => {
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
        </AnimateSharedLayout>
      )}
    </div>
  );
}

export default Posts;
