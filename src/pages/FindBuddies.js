import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { motion } from "framer-motion";
import "../styles/FindBuddies.scss";
import { pageVariants } from "../functions/pageVariants";
import User from "../components/User";

function FindBuddies() {
  const [listOfBuddies, setListOfBuddies] = useState("");
  useEffect(() => {
    db.collection("users")
      .get()
      .then((data) => {
        let list = [];
        data.forEach((doc) => {
          list.push(doc.data());
        });
        setListOfBuddies(list);
      });
  }, []);
  return (
    <motion.div
      className="findBuddies"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <div className="findBuddies__allUsers">
        <h1>All Users</h1>
        <div>
          {listOfBuddies && (
            <div className="findBuddies__userBox">
              {listOfBuddies.map((data) => {
                return (
                  <User
                    key={Math.random()}
                    username={data.username}
                    avatar={data.avatar}
                    userId={data.userId}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default FindBuddies;
