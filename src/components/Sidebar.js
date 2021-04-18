import React, { useEffect, useState } from "react";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import "../styles/Sidebar.scss";
import { AnimatePresence, motion } from "framer-motion";
import { db } from "../lib/firebase";
import PersonIcon from "@material-ui/icons/Person";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import { Avatar } from "@material-ui/core";
import { useDataLayerValue } from "../DataLayer";
import CreatePost from "./CreatePost";
import { Link } from "react-router-dom";
import ListAltOutlinedIcon from "@material-ui/icons/ListAltOutlined";
import ChatIcon from "@material-ui/icons/Chat";
import AnnouncementIcon from "@material-ui/icons/Announcement";

function Sidebar({ sidebarSmall, setSidebarButtonShow, sidebarButtonShow }) {
  const [
    { user_username, createPost, user_profileImage },
    dispatch,
  ] = useDataLayerValue();
  const [notMsg, setNotMsg] = useState(0);
  const [gotNotMsg, setGotNotMsg] = useState(false);

  useEffect(() => {
    const getMsgNot = () => {
      console.log("getting mobile chat not");
      db.collection("chatRoom")
        .doc("3636")
        .onSnapshot((data) => {
          if (data.exists) {
            if (data.data().read === true) {
              setGotNotMsg(false);
            } else {
              setGotNotMsg(true);
            }
          }
        });
    };
    getMsgNot();
  }, []);

  const handleChatNotification = () => {
    db.collection("chatRoom").doc("3636").update({
      read: true,
    });
  };
  /* 
  const handleChatIcon = () => {
    console.log("handling chat to 0");
    db.collection("chatRoom")
      .where("read", "==", false)
      .onSnapshot((data) => {
        data.forEach((doc) => {
          db.collection("chatRoom").doc(doc.id).update({
            read: true,
          });
          setNotMsg(false);
        });
      });
  }; */

  return (
    <div className={sidebarSmall ? "sidebar" : `sidebar-small`}>
      <AnimatePresence>{createPost && <CreatePost />}</AnimatePresence>
      <div className="sidebar__user">
        {!sidebarSmall && <Avatar src={user_profileImage} />}
        <h1>{user_username}</h1>
      </div>
      <div className="sidebar__newPost">
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              dispatch({
                type: "SET_CREATEPOST",
                createPost: true,
              })
            }
          >
            {!sidebarSmall && (
              <>
                <p>
                  Create <br /> New Post
                </p>
              </>
            )}
            <AddCircleIcon />
          </motion.button>
        </Link>
      </div>
      <div className="sidebar__menu">
        <ul>
          <Link to="/">
            <li
              className={sidebarSmall ? "sidebar__menuLiSmall" : ""}
              onClick={() => setSidebarButtonShow(!sidebarButtonShow)}
            >
              <ListAltOutlinedIcon fontSize="small" />
              {!sidebarSmall && (
                <>
                  <p>Posts</p>
                  <ArrowForwardIosIcon fontSize="small" />
                </>
              )}
            </li>
          </Link>
          <Link to="/acc">
            <li
              className={sidebarSmall ? "sidebar__menuLiSmall" : ""}
              onClick={() => setSidebarButtonShow(!sidebarButtonShow)}
            >
              <PersonIcon fontSize="small" />
              {!sidebarSmall && (
                <>
                  <p>My Account</p>
                  <ArrowForwardIosIcon fontSize="small" />
                </>
              )}
            </li>
          </Link>
          <Link to="/findbuddies">
            <li
              className={sidebarSmall ? "sidebar__menuLiSmall" : ""}
              onClick={() => setSidebarButtonShow(!sidebarButtonShow)}
            >
              <EmojiPeopleIcon fontSize="small" />
              {!sidebarSmall && (
                <>
                  <p>Find Buddies</p>
                  <ArrowForwardIosIcon fontSize="small" />
                </>
              )}
            </li>
          </Link>
        </ul>
      </div>
      <div className="sidebar__chatIcon">
        {gotNotMsg ? (
          <Link to="/chat" onClick={() => handleChatNotification()}>
            <motion.div
              className="sidebar__chatIcon-btn"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1.05 }}
              transition={{
                repeat: Infinity,
                duration: 0.7,
                repeatType: "reverse",
              }}
            >
              <AnnouncementIcon />
            </motion.div>
          </Link>
        ) : (
          <Link to="/chat">
            <div className="sidebar__chatIcon-btn">
              <ChatIcon />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
