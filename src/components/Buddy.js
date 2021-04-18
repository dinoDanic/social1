import React, { useEffect, useRef, useState } from "react";
import { db, firebasetime } from "../lib/firebase";
import { useDataLayerValue } from "../DataLayer";
import "../styles/Buddy.scss";
import { AnimatePresence, motion } from "framer-motion";
import Message from "../components/Message";
import { Link } from "react-router-dom";

function Buddy({ buddyId, buddyName }) {
  const [{ user_userId }] = useDataLayerValue();
  const [openBuddyChat, setOpenBuddyChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [currentChatId, setCurrentChatId] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [notMsg, setNotMsg] = useState(0);
  const [isNotEmpty, setIsNotEmpty] = useState(false);
  const inputMessage = useRef();
  const displayChat = useRef();
  const bottomRef = useRef();

  const startChat = () => {
    setOpenBuddyChat(!openBuddyChat);
    if (!openBuddyChat) {
      checkRoom();
      removeMsgNot();
    }
  };

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
      db.collection("chatRoom").doc(currentChatId).update({
        read: false,
      });
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

  const getChatId = () => {
    if (buddyId < user_userId) {
      return buddyId + user_userId;
    }
    if (buddyId > user_userId) {
      return user_userId + buddyId;
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
  const scrollToBottom = () => {
    if (openBuddyChat) {
      bottomRef.current.scrollIntoView({
        /* behavior: "smooth", */
        block: "start",
      });
    }
  };

  useEffect(() => {
    const getChatWindows = () => {
      const msg = document.querySelector(".buddy__chatHolder");
      if (msg) {
        const msgParent = msg.parentElement;
        const msgPrentChildren = msgParent.getElementsByClassName(
          "buddy__chatHolder"
        );
        let msgCount = msgPrentChildren.length;
        let margin = 200;
        for (let i = 0; i < msgCount; i++) {
          msgPrentChildren[i].style.right = `${margin}px`;
          margin = margin + 320;
        }
      }
    };
    getChatWindows();
  }, [openBuddyChat, setOpenBuddyChat]);

  useEffect(() => {
    loadMessages();
  }, [currentChatId]);

  useEffect(() => {
    scrollToBottom();
  }, [currentChatId, openBuddyChat, messageList]);

  useEffect(() => {
    getMsgNot();
    if (notMsg > 0) {
      setIsNotEmpty(true);
    } else {
      setIsNotEmpty(false);
    }
  }, [notMsg, setNotMsg]);

  return (
    <>
      <motion.div
        className="buddy__holder"
        onClick={() => startChat()}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.3}
      >
        <motion.div className="buddy__hole"></motion.div>
        <motion.div
          onClick={() => startChat()}
          className="buddy"
          layoutId={buddyId}
        >
          <motion.h4>{buddyName}</motion.h4>
          {isNotEmpty && (
            <div className="buddy__counter">
              <p>{notMsg}</p>
            </div>
          )}
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {openBuddyChat && (
          <motion.div className="buddy__chatHolder" layoutId={buddyId}>
            <div className="buddy__chatWith">
              <Link to={`/user/${buddyId}`}>
                <motion.h4>{buddyName}</motion.h4>
              </Link>
            </div>
            <div className="buddy__chat">
              <div className="buddy__displayChat" ref={displayChat}>
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
            </div>
            <div className="buddy__chat--send">
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

export default Buddy;
