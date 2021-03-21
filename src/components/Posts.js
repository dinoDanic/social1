import React, { useEffect, useState } from "react";
import "../styles/Posts.scss";
import { db } from "../lib/firebase";
import Post from "./Post";
import { AnimateSharedLayout } from "framer-motion";
function Posts() {
  const [postList, setPostList] = useState([]);
  const [postListPopular, setPostListPopular] = useState([]);
  useEffect(() => {
    db.collection("posts")
      .orderBy("created", "desc")
      .onSnapshot((data) => {
        var list = [];
        data.docs.forEach((doc) => {
          list.push(doc.data());
        });
        setPostList(list);
      });
  }, []);
  return (
    <>
      <div className="posts">
        <h1>Recent posts</h1>
        {postList && (
          <AnimateSharedLayout type="crossfade">
            <div className="posts__post">
              {postList.map((data) => {
                return (
                  <Post
                    id={data.id}
                    key={Math.random()}
                    postText={data.postText}
                    username={data.username}
                    image={data.image}
                    postList={postList}
                  />
                );
              })}
            </div>
          </AnimateSharedLayout>
        )}
      </div>
      <div className="posts">
        <h1>Most popular posts</h1>
      </div>
    </>
  );
}

export default Posts;
