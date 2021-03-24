import React, { useEffect, useState } from "react";
import "../styles/Posts.scss";
import { db } from "../lib/firebase";
import Post from "../components/Post";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import { pageVariants } from "../functions/pageVariants";
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
    <motion.div
      key="1"
      className="posts"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <h1>Recent posts</h1>
      {postList && (
        <AnimateSharedLayout type="crossfade">
          <div className="posts__post">
            {postList.map((data) => {
              return (
                <Post
                  userId={data.userId}
                  postId={data.postId}
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
      <div className="posts">
        <h1>Most popular posts</h1>
      </div>
    </motion.div>
  );
}

export default Posts;
