import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../lib/firebase";
import { pageVariants } from "../functions/pageVariants";
import { AnimateSharedLayout, motion } from "framer-motion";
import Post from "../components/Post";
import { Button } from "@material-ui/core";
import "../styles/UserProfile.scss";
import SportsKabaddiIcon from "@material-ui/icons/SportsKabaddi";
import { useDataLayerValue } from "../DataLayer";

function UserProfile() {
  const [{ user_userId, user_username }, dispatch] = useDataLayerValue();
  const location = useLocation();
  const [profileUsername, setProfileUsername] = useState("");
  const [postList, setPostList] = useState([]);
  const [checkBuddyStatus, setCheckBuddyStatus] = useState();
  const getCurrentLocation = () => {
    let currentLocation = location.pathname.split("/")[2];
    return currentLocation;
  };
  const getUser = () => {
    db.collection("users")
      .where("userId", "==", `${getCurrentLocation()}`)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          setProfileUsername(doc.data().username);
        });
      });
  };
  const getUsersPosts = () => {
    db.collection("posts")
      .where("userId", "==", `${getCurrentLocation()}`)
      .onSnapshot((data) => {
        var list = [];
        data.forEach((doc) => {
          list.push(doc.data());
        });
        setPostList(list);
      });
  };
  const addABuddy = () => {
    db.collection("users").doc(user_userId).collection("buddys").doc().set({
      buddyId: getCurrentLocation(),
      buddyName: profileUsername,
    });
    checkBuddys();
  };
  const removeBuddy = () => {
    console.log("remove buddy");
    db.collection("users")
      .doc(user_userId)
      .collection("buddys")
      .where("buddyId", "==", `${getCurrentLocation()}`)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          doc.ref.delete();
          console.log("DELETE");
          setCheckBuddyStatus(false);
        });
      });
  };
  const checkBuddys = () => {
    if (user_userId) {
      db.collection("users")
        .doc(user_userId)
        .collection("buddys")
        .get()
        .then((data) => {
          data.forEach((doc) => {
            let buddy = doc.data().buddyName;
            console.log(buddy);
            if (buddy.includes(profileUsername)) {
              console.log("setting to true");
              setCheckBuddyStatus(true);
            } else {
              console.log("setting to false");
              setCheckBuddyStatus(false);
            }
          });
        });
    }
  };
  useEffect(() => {
    checkBuddys();
  }, []);

  useEffect(() => {
    getUser();
    getUsersPosts();
  }, [location]);
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="userProfile">
        <h1>All posts from {profileUsername}</h1>

        {postList && (
          <AnimateSharedLayout type="crossfade">
            <div className="userProfile__post posts__post">
              {postList.map((data) => {
                return (
                  <Post
                    userId={data.userId}
                    postId={data.postId}
                    key={Math.random()}
                    postText={data.postText}
                    username={data.username}
                    image={data.image}
                    postList={postList}
                  />
                );
              })}
            </div>
          </AnimateSharedLayout>
        )}
        <div className="userProfile__addUser">
          {checkBuddyStatus ? (
            <Button
              onClick={() => removeBuddy()}
              variant="contained"
              color="secondary"
            >
              <SportsKabaddiIcon /> <p>Remove Buddy :(</p>
            </Button>
          ) : (
            <Button
              onClick={() => addABuddy()}
              variant="contained"
              color="primary"
            >
              <SportsKabaddiIcon /> <p>add a Buddy</p>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default UserProfile;
