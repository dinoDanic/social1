import React, { useEffect, useRef, useState } from "react";
import { db, firebasetime } from "../lib/firebase";
import { useDataLayerValue } from "../DataLayer";
import "../styles/Buddy.scss";
import { motion } from "framer-motion";

function Buddy({ buddyId, buddyName }) {
  const [openBuddyChat, setOpenBuddyChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [currentChatId, setCurrentChatId] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [roomCheck, setRoomCheck] = useState(false);
  const inputMessage = useRef();
  const startChat = () => {
    setOpenBuddyChat(!openBuddyChat);
    if (!openBuddyChat) {
      checkRoom();
    }
  };

  const [{ user_userId }] = useDataLayerValue();

  const handleSendMsg = (e) => {
    e.preventDefault();
    if (currentChatId) {
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
    }
    inputMessage.current.value = "";
    loadMessages();
  };

  const createChatRoom = () => {
    console.log("creating chat room");
    db.collection("chatRoom").add({
      chatUserIds: [buddyId, user_userId],
    });
  };

  const checkRoom = () => {
    console.log("CHEKING ROOM");
    db.collection("chatRoom")
      .where("chatUserIds", "array-contains", buddyId, user_userId)
      .get()
      .then((data) => {
        setRoomCheck(true);
        data.forEach((doc) => {
          if (doc.exists) {
            setCurrentChatId(doc.id);
            console.log("hey you have a chatRoom with id: ", doc.id);
            return;
          }
        });
      });
  };
  useEffect(() => {
    console.log("loading messeges");
    loadMessages();
  }, [currentChatId]);
  const loadMessages = () => {
    if (currentChatId) {
      db.collection("chatRoom")
        .doc(currentChatId)
        .collection("messeges")
        .orderBy("timestamp", "asc")
        .limit(12)
        .onSnapshot((data) => {
          let list = [];
          data.forEach((doc) => {
            list.push(doc.data().message);
          });
          setMessageList(list);
        });
    }
  };
  return (
    <>
      <motion.div
        onClick={() => startChat()}
        className="buddy"
        key={Math.random()}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <h4>{buddyName}</h4>
        <p>{buddyId}</p>
      </motion.div>
      {openBuddyChat && (
        <div className="buddy__chat">
          chat with {buddyName}
          <div className="buddy__displayChat">
            {messageList.map((data) => {
              return <p key={Math.random()}>{data}</p>;
            })}
          </div>
          <div className="buddy__chat--send">
            <form>
              <input
                ref={inputMessage}
                type="text"
                onChange={(e) => setChatMessage(e.target.value)}
              />
              <button onClick={handleSendMsg}>send</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Buddy;
