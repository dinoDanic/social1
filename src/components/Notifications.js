import React, { useEffect, useState } from "react";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import "../styles/Notifications.scss";
import { Button } from "@material-ui/core";
import { db, FB_ARRAY } from "../lib/firebase";
import { useDataLayerValue } from "../DataLayer";

function Notifications() {
  const [{ user_userId }, dispatch] = useDataLayerValue();
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
      console.log("checking like notifications");
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
  /* const checkLikeNot = () => {
    if (user_userId) {
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
  }; */

  const checkIfUnreadNot = () => {
    console.log(likedList);
    if (likedList.length > 0) {
      setNotStatusButton("not__gotNot");
    }
    if (likedList.length <= 0) {
      setNotStatusButton("");
    }
  };

  const likeToRead = (key, id) => {
    db.collection("not_likes")
      .where("customKey", "==", key)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          db.collection("not_likes").doc(doc.id).update({
            read: true,
          });
          dispatch({
            type: "SET_CURRENT_POSTID",
            currentPostOpenId: id,
          });
        });
      });

    setNotificationOnOff(false);
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
                onClick={() => likeToRead(data.customKey, data.likedPostId)}
              >
                <p>{data.likedFrom} liked your post</p>
              </div>
            );
          })}
          <hr />
          {likedListRead.map((data) => {
            return (
              <div className="not__likedRead">
                <p>{data.likedFrom} liked your post</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Notifications;
