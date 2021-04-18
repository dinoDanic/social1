import React, { useState, useEffect, useRef } from "react";
import { Avatar } from "@material-ui/core";
import { db, firebasetime } from "../lib/firebase";
import { AnimatePresence, motion } from "framer-motion";
import "./../styles/ChatWith.scss";
import { useDataLayerValue } from "../DataLayer";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Message from "./Message";

function ChatWith({ buddyName, buddyId }) {
  const [{ user_userId }, dispatch] = useDataLayerValue();
  const [bigChat, setBigChat] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const [currentChatId, setCurrentChatId] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [notMsg, setNotMsg] = useState(0);
  const [isNotEmpty, setIsNotEmpty] = useState(false);
  const bottomRef = useRef();
  const inputMessage = useRef();

  const handleSendMsg = (e) => {
    e.preventDefault();
    if (currentChatId && inputMessage.current.value !== "") {
      db.collection("chatRoom")
        .doc(currentChatId)
        .collection("messeges")
        .add({
          name: buddyName,
          id: buddyId,
          message: chatMessage,
          timestamp: firebasetime,
        })
        .catch(function (error) {
          console.error(error);
        });
      // SETAT UNREAD MSG
      db.collection("chatRoom")
        .doc(currentChatId)
        .collection("notifications")
        .doc()
        .set({
          read: false,
          sentTo: buddyId,
        });
      // SET UNREAD FOR MOBILE
      db.collection("chatRoom").doc(currentChatId).set(
        {
          read: false,
        },
        { merge: true }
      );
      // SET READ FALSE GLOBAL 3636
      db.collection("chatRoom").doc("3636").set({
        read: false,
      });
    }
    inputMessage.current.value = "";
    loadMessages();
  };

  const getMsgNot = () => {
    db.collection("chatRoom")
      .where("chatUserIds", "==", getChatId())
      .onSnapshot((data) => {
        data.forEach((doc) => {
          db.collection("chatRoom")
            .doc(doc.id)
            .collection("notifications")
            .where("read", "==", false)
            .where("sentTo", "==", user_userId)
            .onSnapshot((data) => {
              setNotMsg(data.size);
            });
        });
      });
  };
  useEffect(() => {
    getMsgNot();
    if (notMsg > 0) {
      setIsNotEmpty(true);
    } else {
      setIsNotEmpty(false);
    }
  }, [notMsg, setNotMsg]);

  const removeMsgNot = () => {
    db.collection("chatRoom")
      .where("chatUserIds", "==", getChatId())
      .get()
      .then((data) => {
        data.forEach((doc) => {
          db.collection("chatRoom")
            .doc(doc.id)
            .collection("notifications")
            .where("read", "==", false)
            .where("sentTo", "==", user_userId)
            .get()
            .then((data) => {
              data.forEach((doc) => {
                doc.ref.delete();
              });
            });
        });
      });
  };

  const startChat = () => {
    setBigChat(!bigChat);
    if (!bigChat) {
      checkRoom();
      removeMsgNot();
    }
  };

  const loadMessages = () => {
    if (currentChatId) {
      db.collection("chatRoom")
        .doc(currentChatId)
        .collection("messeges")
        .orderBy("timestamp", "asc")
        .onSnapshot((data) => {
          let list = [];
          data.forEach((doc) => {
            list.push(doc.data());
          });
          setMessageList(list);
        });
    }
  };

  const checkRoom = () => {
    db.collection("chatRoom")
      .where("chatUserIds", "==", getChatId())
      .get()
      .then((data) => {
        data.forEach((doc) => {
          if (doc.exists) {
            setCurrentChatId(doc.id);
            console.log("hey you have a chatRoom with id:", doc.id);
          }
        });
      });
  };

  const getChatId = () => {
    if (buddyId < user_userId) {
      return buddyId + user_userId;
    }
    if (buddyId > user_userId) {
      return user_userId + buddyId;
    }
  };

  const scrollToBottom = () => {
    if (bigChat) {
      bottomRef.current.scrollIntoView({
        /* behavior: "smooth", */
        block: "start",
      });
    }
  };

  useEffect(() => {
    loadMessages();
  }, [currentChatId]);

  useEffect(() => {
    scrollToBottom();
    if (!bigChat) {
      document.body.style.overflowY = "scroll";
    } else {
      document.body.style.overflowY = "hidden";
    }
  }, [currentChatId, bigChat, messageList]);

  return (
    <>
      <div className="chatWith" onClick={() => startChat()}>
        <div className="chatWith__user">
          <div className="chatWith__avatar">
            <Avatar />
          </div>
          <div className="chatWith__username">
            <h3>{buddyName}</h3>
          </div>
          {isNotEmpty && (
            <div className="chatWith__counter">
              <p>{notMsg}</p>
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {bigChat && (
          <motion.div
            className="chatWith__bigChat"
            transition={{ duration: 0.3 }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            <div className="chatWith__top">
              <div
                className="chatWith__back"
                onClick={() => setBigChat(!bigChat)}
              >
                <ArrowBackIosIcon />
              </div>
              <div className="chatWith__chatWith">
                <div className="chatWith__chatWith-avatar">
                  <Avatar />
                </div>
                <div className="chatWith__chatWith-name">
                  <h3>Chat with {buddyName}</h3>
                </div>
              </div>
            </div>
            <div className="chat__chat">
              {messageList.map((data) => {
                return (
                  <Message
                    key={Math.random()}
                    message={data.message}
                    timestamp={data.timestamp}
                    senderId={data.id}
                  />
                );
              })}
              <div className="scrollTo" ref={bottomRef}></div>
            </div>
            <div className="chat__chat--send">
              <form>
                <input
                  ref={inputMessage}
                  type="text"
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="type here..."
                />
                <button onClick={handleSendMsg}>send</button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ChatWith;
