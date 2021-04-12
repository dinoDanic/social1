import React, { useEffect, useState, useRef } from "react";
import "../styles/Buddys.scss";
import { db } from "../lib/firebase";
import { useDataLayerValue } from "../DataLayer";
import Buddy from "../components/Buddy";
import { AnimateSharedLayout, motion } from "framer-motion";

function Buddys() {
  const [{ user_userId }] = useDataLayerValue();
  const [buddyList, setBuddyList] = useState([]);
  const buddysList = useRef();

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
    <motion.div className="buddys">
      <h4>Buddies</h4>
      <AnimateSharedLayout type="crossfade">
        {buddyList && (
          <>
            <motion.div className="buddys__list" ref={buddysList}>
              {buddyList.map((data) => {
                return (
                  <Buddy
                    key={Math.random()}
                    buddyId={data.buddyId}
                    buddyName={data.buddyName}
                  />
                );
              })}
            </motion.div>
          </>
        )}
      </AnimateSharedLayout>
    </motion.div>
  );
}

export default Buddys;
