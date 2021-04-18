import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { pageVariants } from "../../functions/pageVariants";
import "../../styles/Chat.scss";
import { db } from "../../lib/firebase";
import { useDataLayerValue } from "../../DataLayer";
import ChatWith from "../../components/ChatWith";

function Chat() {
  const [{ user_userId }] = useDataLayerValue();
  const [buddyList, setBuddyList] = useState([]);

  useEffect(() => {
    if (user_userId) {
      db.collection("users")
        .doc(user_userId)
        .collection("buddys")
        .onSnapshot((data) => {
          var list = [];
          data.forEach((doc) => {
            list.push(doc.data());
          });
          setBuddyList(list);
        });
    }
  }, [user_userId]);

  return (
    <motion.div
      className="chat"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <div className="chat__list">
        {buddyList.map((data) => {
          return (
            <ChatWith
              key={Math.random()}
              buddyId={data.buddyId}
              buddyName={data.buddyName}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

export default Chat;
