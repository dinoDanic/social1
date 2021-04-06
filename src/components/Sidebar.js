import React from "react";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import "../styles/Sidebar.scss";
import { AnimatePresence, motion } from "framer-motion";
import PersonIcon from "@material-ui/icons/Person";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import { Avatar } from "@material-ui/core";
import { useDataLayerValue } from "../DataLayer";
import CreatePost from "./CreatePost";
import { Link } from "react-router-dom";
import ListAltOutlinedIcon from "@material-ui/icons/ListAltOutlined";

function Sidebar() {
  const [
    { user_username, createPost, user_profileImage },
    dispatch,
  ] = useDataLayerValue();

  return (
    <div className="sidebar">
      <AnimatePresence>{createPost && <CreatePost />}</AnimatePresence>
      <div className="sidebar__user">
        <Avatar src={user_profileImage} />
        <h1>{user_username}</h1>
      </div>
      <div className="sidebar__newPost">
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
          <p>
            Create <br /> New Post
          </p>
          <AddCircleIcon />
        </motion.button>
      </div>
      <div className="sidebar__menu">
        <ul>
          <Link to="/">
            <li>
              <ListAltOutlinedIcon fontSize="small" />
              <p>Posts</p>
              <ArrowForwardIosIcon fontSize="small" />
            </li>
          </Link>
          <Link to="/acc">
            <li>
              <PersonIcon fontSize="small" />
              <p>My Account</p>
              <ArrowForwardIosIcon fontSize="small" />
            </li>
          </Link>
          <Link to="/findbuddies">
            <li>
              <EmojiPeopleIcon fontSize="small" />
              <p>Find Buddies</p>
              <ArrowForwardIosIcon fontSize="small" />
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
