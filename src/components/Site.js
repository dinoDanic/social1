import React from "react";
import "../styles/Site.scss";
import Posts from "./Posts";
import Sidebar from "./Sidebar";

function Site() {
  return (
    <div className="site">
      <div className="sec1">
        <Sidebar />
      </div>
      <div className="sec2">
        <Posts />
      </div>
      {/* <div className="sec3"></div> */}
    </div>
  );
}

export default Site;
