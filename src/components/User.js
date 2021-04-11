import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { Avatar, Button } from "@material-ui/core";
import "../styles/User.scss";
import { useDataLayerValue } from "../DataLayer";
import { Link } from "react-router-dom";

function User({ username, avatar, userId }) {
  const [{ user_userId }] = useDataLayerValue();
  const [numberOfPosts, setNumberOfPosts] = useState(0);
  const [numberOfBuddies, setNumberOfBuddies] = useState(0);

  useEffect(() => {
    if (userId) {
      db.collection("posts")
        .where("userId", "==", userId)
        .get()
        .then((data) => {
          let list = [];
          data.forEach((doc) => {
            list.push(doc.data());
          });
          setNumberOfPosts(list.length);
        });
      db.collection("users")
        .doc(userId)
        .collection("buddys")
        .get()
        .then((data) => {
          setNumberOfBuddies(data.size);
        });
    }
  }, []);
  return (
    <div className="user">
      <div className="user__user">
        <div className="user__avatar">
          <Avatar src={avatar} />
        </div>
        <div className="user__name">
          <h4>{username}</h4>
        </div>
      </div>
      <div className="user__info">
        <div className="user__posts">
          <p>
            <strong>{numberOfPosts}</strong>
          </p>
          <p>Posts</p>
        </div>
        <div className="user__buddies">
          <p>
            <strong>{numberOfBuddies}</strong>
          </p>
          <p>Buddies</p>
        </div>
      </div>
      <div className="user__viewProfile">
        <Link to={`/user/${userId}`}>
          <Button variant="contained">View Profile</Button>
        </Link>
      </div>
    </div>
  );
}

export default User;
