import React from "react";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import "../styles/Sidebar.scss";
import { motion } from "framer-motion";
import PersonIcon from "@material-ui/icons/Person";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import PublicIcon from "@material-ui/icons/Public";
import { Avatar } from "@material-ui/core";
import { useDataLayerValue } from "../DataLayer";

function Sidebar({ setCreatePost }) {
  const [{ user_username }, dispatch] = useDataLayerValue();
  return (
    <div className="sidebar">
      <div className="sidebar__user">
        <Avatar />
        <h1>{user_username}</h1>
      </div>
      <div className="sidebar__newPost">
        <motion.button
          variant="contained"
          color="primary"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setCreatePost(true)}
        >
          <p>
            Create <br /> New Post
          </p>
          <AddCircleIcon />
        </motion.button>
      </div>
      <div className="sidebar__menu">
        <ul>
          <li>
            <PersonIcon fontSize="small" />
            <p>My Account</p>
            <ArrowForwardIosIcon fontSize="small" />
          </li>
          <li>
            <EmojiPeopleIcon fontSize="small" />
            <p>Friends</p>
            <ArrowForwardIosIcon fontSize="small" />
          </li>
          <li>
            <PublicIcon fontSize="small" />
            <p>Discover</p>
            <ArrowForwardIosIcon fontSize="small" />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
