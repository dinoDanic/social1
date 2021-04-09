import React, { useEffect, useState } from "react";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import "../styles/Notifications.scss";
import { Button } from "@material-ui/core";
import { db } from "../lib/firebase";
import { useDataLayerValue } from "../DataLayer";

function Notifications() {
  const [{ user_userId }] = useDataLayerValue();
  const [notificationOnOff, setNotificationOnOff] = useState(false);
  const [likedList, setLikedList] = useState([]);
  const [likedListRead, setLikedListRead] = useState([]);
  const [notStatusButton, setNotStatusButton] = useState("");

  useEffect(() => {
    checkIfUnreadNot();
    checkLikeNot();
  }, [user_userId]);
  const checkLikeNot = () => {
    if (user_userId) {
      console.log("useef");
      db.collection("not_likes")
        .where("likedToId", "==", user_userId)
        .where("read", "==", false)
        .onSnapshot((data) => {
          let list = [];
          data.forEach((doc) => {
            list.push(doc.data());
          });
          setLikedList(list);
        });
      db.collection("not_likes")
        .where("likedToId", "==", user_userId)
        .where("read", "==", true)
        .onSnapshot((data) => {
          let list = [];
          data.forEach((doc) => {
            list.push(doc.data());
          });
          setLikedListRead(list);
        });
    }
  };

  const checkIfUnreadNot = () => {
    console.log(likedList);
    if (likedList.length > 0) {
      setNotStatusButton("not__gotNot");
    }
    if (likedList.length <= 0) {
      setNotStatusButton("");
    }
  };

  const likeToRead = (postID) => {
    db.collection("not_likes").doc(postID).update({
      read: true,
    });
  };
  return (
    <div className="notifications">
      <div className="not__button">
        <Button
          className={notStatusButton}
          variant="outlined"
          onClick={() => setNotificationOnOff(!notificationOnOff)}
        >
          <NotificationsNoneIcon />
        </Button>
      </div>
      {notificationOnOff && (
        <div className="not__window">
          {likedList.map((data) => {
            return (
              <div
                className="not__liked"
                onClick={() => likeToRead(data.likedPostId)}
              >
                <p>{data.likedFrom} liked your post</p>
              </div>
            );
          })}
          <hr />
          {likedListRead.map((data) => {
            return (
              <div className="not__likedRead">
                <p>{data.likedFrom} liked your post READED</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Notifications;
