import React, { useEffect, useState } from "react";
import "../styles/Posts.scss";
import { db } from "../lib/firebase";
import Post from "../components/Post";
import { AnimateSharedLayout, motion } from "framer-motion";
import { pageVariants } from "../functions/pageVariants";
import { useDataLayerValue } from "../DataLayer";

function Posts() {
  const [{ user_userId }] = useDataLayerValue();
  const [postList, setPostList] = useState([]);
  const [buddiesList, setBuddiesList] = useState([]);
  useEffect(() => {
    db.collection("posts")
      .orderBy("created", "desc")
      .limit(20)
      .onSnapshot((data) => {
        var list = [];
        data.forEach((doc) => {
          list.push(doc.data());
        });
        setPostList(list);
      });
  }, []);
  useEffect(() => {
    if (user_userId) {
      console.log("starting", user_userId);
      db.collection("users")
        .doc(user_userId)
        .collection("buddys")
        .onSnapshot((data) => {
          data.forEach((doc) => {
            db.collection("posts")
              .where("userId", "==", `${doc.data().buddyId}`)
              .orderBy("created", "desc")
              .limit(20)
              .onSnapshot((data) => {
                var list2 = [];
                data.forEach((doc) => {
                  if (doc.exists) {
                    list2.push(doc.data());
                  }
                });
                setBuddiesList(list2);
                console.log(buddiesList);
              });
          });
        });
    }
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
      <h1>Posts from Buddies</h1>

      {buddiesList && (
        <AnimateSharedLayout type="crossfade">
          <div className="posts__post">
            {buddiesList.map((data) => {
              return (
                <Post
                  userAvatar={data.avatar}
                  userId={data.userId}
                  postId={data.postId}
                  key={Math.random()}
                  postText={data.postText}
                  username={data.username}
                  image={data.image}
                  postList={postList}
                  imageDb={data.imageDb}
                />
              );
            })}
          </div>
        </AnimateSharedLayout>
      )}
      <h1>Recent posts</h1>
      {postList && (
        <AnimateSharedLayout type="crossfade">
          <div className="posts__post">
            {postList.map((data) => {
              return (
                <Post
                  userAvatar={data.avatar}
                  userId={data.userId}
                  postId={data.postId}
                  key={Math.random()}
                  postText={data.postText}
                  username={data.username}
                  image={data.image}
                  postList={postList}
                  imageDb={data.imageDb}
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
