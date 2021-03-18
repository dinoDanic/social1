import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import "../styles/Site.scss";
import CreatePost from "./CreatePost";
import Posts from "./Posts";
import Sidebar from "./Sidebar";

function Site() {
  const [createPost, setCreatePost] = useState(false);
  return (
    <div className="site">
      <div className="sec1">
        <Sidebar setCreatePost={setCreatePost} />
      </div>
      <div className="sec2">
        <AnimatePresence>
          {createPost && (
            <motion.div
              className="createPost__tata"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <motion.div
                className="createPost__layer"
                onClick={() => setCreatePost(false)}
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1, position: "absolute" }}
              ></motion.div>
              <CreatePost setCreatePost={setCreatePost} />
            </motion.div>
          )}
        </AnimatePresence>
        <Posts />
      </div>
      {/* <div className="sec3"></div> */}
    </div>
  );
}

export default Site;
