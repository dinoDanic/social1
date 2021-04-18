import React, { useEffect, useState } from "react";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import "../styles/Notifications.scss";
import { Button } from "@material-ui/core";
import { db } from "../lib/firebase";
import { useDataLayerValue } from "../DataLayer";

function Notifications() {
  const [{ user_userId }, dispatch] = useDataLayerValue();
  const [notificationOnOff, setNotificationOnOff] = useState(false);
  const [likedList, setLikedList] = useState([]);
  const [commentList, setCommentList] = useState([]);
  const [likedListRead, setLikedListRead] = useState([]);
  const [commentListRead, setCommentListRead] = useState([]);
  const [notStatusButton, setNotStatusButton] = useState("");
  const [gotNotifications, setGotNotifications] = useState(false);

  useEffect(() => {
    checkLikeNot();
    checkCommentNot();
  }, [user_userId]);

  useEffect(() => {
    if (commentList.length > 0 || likedList.length > 0) {
      setGotNotifications(true);
    } else {
      setGotNotifications(false);
    }
  }, [commentList, likedList]);

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
  const checkCommentNot = () => {
    if (user_userId) {
      console.log("checking comment notifications");
      db.collection("not_comment")
        .where("commentToId", "==", user_userId)
        .where("read", "==", false)
        .onSnapshot((data) => {
          let list = [];
          data.forEach((doc) => {
            list.push(doc.data());
          });
          setCommentList(list);
        });
      db.collection("not_comment")
        .where("commentToId", "==", user_userId)
        .where("read", "==", true)
        .onSnapshot((data) => {
          let list = [];
          data.forEach((doc) => {
            list.push(doc.data());
          });
          setCommentListRead(list);
        });
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
  const commentToRead = (key, id) => {
    db.collection("not_comment")
      .where("customKey", "==", key)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          db.collection("not_comment").doc(doc.id).update({
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

  const getAllNotUnread = () => {
    let comLength = commentList.length;
    let likeLength = likedList.length;
    let sumaLength = comLength + likeLength;
    return sumaLength;
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
          {gotNotifications && (
            <div className="not__counter">
              <p>{getAllNotUnread()}</p>
            </div>
          )}
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
          {commentList.map((data) => {
            return (
              <div
                className="not__liked"
                onClick={() =>
                  commentToRead(data.customKey, data.commentPostId)
                }
              >
                <p>{data.commentFrom} comment your post</p>
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
          {commentListRead.map((data) => {
            return (
              <div className="not__likedRead">
                <p>{data.commentFrom} comment your post</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Notifications;
