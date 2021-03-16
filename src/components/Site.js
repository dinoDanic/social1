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
        {createPost && <CreatePost setCreatePost={setCreatePost} />}
        <Posts />
      </div>
      {/* <div className="sec3"></div> */}
    </div>
  );
}

export default Site;
