import React, { useEffect, useState } from "react";
import "../styles/Message.scss";
import { useDataLayerValue } from "../DataLayer";

function Message({ message, timestamp, senderId }) {
  const [{ user_userId }] = useDataLayerValue();

  const [activeClass, setActiveClass] = useState("");
  const getMsgTime = () => {
    if (timestamp) {
      let myTime = timestamp.toDate();
      let hours = myTime.getHours();
      let minutes = myTime.getMinutes();
      return `${hours}:${minutes}`;
    }
  };

  useEffect(() => {
    if (senderId !== user_userId) {
      setActiveClass("message__active");
    } else {
      setActiveClass("");
    }
  }, [activeClass]);
  return (
    <div className={activeClass}>
      <div className="message">
        <div className="message__text">
          <p>{message}</p>
        </div>
        <div className="message__time">
          <p>{getMsgTime()}</p>
        </div>
      </div>
    </div>
  );
}

export default Message;
