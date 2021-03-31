import React, { useEffect, useState } from "react";
import "../styles/Buddys.scss";
import { db } from "../lib/firebase";
import { useDataLayerValue } from "../DataLayer";
import Buddy from "../components/Buddy";

function Buddys() {
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
    <div className="buddys">
      <h1>Buddys</h1>
      {buddyList && (
        <div className="buddys__list">
          {buddyList.map((data) => {
            return (
              <Buddy
                key={Math.random()}
                buddyId={data.buddyId}
                buddyName={data.buddyName}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Buddys;
