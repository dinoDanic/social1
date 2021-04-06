import React, { useEffect, useState } from "react";
import "../styles/UserProfile.scss";
import { db } from "../lib/firebase";
import { useLocation } from "react-router-dom";
import { pageVariants } from "../functions/pageVariants";
import { AnimateSharedLayout, motion } from "framer-motion";
import Post from "../components/Post";
import { Button } from "@material-ui/core";
import SportsKabaddiIcon from "@material-ui/icons/SportsKabaddi";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import { useDataLayerValue } from "../DataLayer";

function UserProfile() {
  const [{ user_userId, user_username }] = useDataLayerValue();
  const location = useLocation();
  const [profileUsername, setProfileUsername] = useState("");
  const [postList, setPostList] = useState([]);
  const [checkBuddyStatus, setCheckBuddyStatus] = useState();
  const [checkIfUserIsUser, setCheckIfUserIsUser] = useState(false);
  const getCurrentLocation = () => {
    let currentLocation = location.pathname.split("/")[2];
    return currentLocation;
  };

  const addABuddy = () => {
    console.log("ADDING BUDDY");
    db.collection("users").doc(user_userId).collection("buddys").doc().set({
      buddyId: getCurrentLocation(),
      buddyName: profileUsername,
    });
    db.collection("users")
      .doc(getCurrentLocation())
      .collection("buddys")
      .doc()
      .set({
        buddyId: user_userId,
        buddyName: user_username,
      });
    checkBuddy();
    createChatRoom();
  };
  const removeBuddy = () => {
    console.log("REMOVE BUDDY");
    db.collection("users")
      .doc(user_userId)
      .collection("buddys")
      .where("buddyId", "==", `${getCurrentLocation()}`)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          doc.ref.delete();
        });
        checkBuddy();
      });
    db.collection("users")
      .doc(getCurrentLocation())
      .collection("buddys")
      .where("buddyId", "==", user_userId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          doc.ref.delete();
        });
        checkBuddy();
      });
    removeChatRoom();
  };
  const createChatId = () => {
    if (getCurrentLocation() < user_userId) {
      return getCurrentLocation() + user_userId;
    }
    if (getCurrentLocation() > user_userId) {
      return user_userId + getCurrentLocation();
    }
  };
  const createChatRoom = () => {
    console.log("creating chat room");
    db.collection("chatRoom").add({
      chatUserIds: createChatId(),
    });
  };
  /* 
  const removeChatRoom = () => {
    console.log("removing chat room");
    db.collection("chatRoom")
      .where("chatUserIds", "array-contains", getCurrentLocation(), user_userId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          if (doc.exists) {
            doc.ref.delete();
          }
          checkBuddy();
        });
      });
  }; */

  const removeChatRoom = () => {
    console.log("removing chat room", createChatId());
    db.collection("chatRoom")
      .where("chatUserIds", "==", createChatId())
      .get()
      .then((data) => {
        data.forEach((doc) => {
          if (doc.exists) {
            doc.ref.delete();
          }
          checkBuddy();
        });
      });
  };
  const checkBuddy = () => {
    if (user_userId) {
      console.log("CHEKING BUDDY");
      db.collection("users")
        .doc(user_userId)
        .collection("buddys")
        .where("buddyId", "==", `${getCurrentLocation()}`)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            console.log("the same name");
            setCheckBuddyStatus(true);
          });
        });
      console.log("not the same name");
      setCheckBuddyStatus(false);
    }
  };
  const checkUserUser = () => {
    if (user_userId === getCurrentLocation()) {
      setCheckIfUserIsUser(true);
    } else {
      setCheckIfUserIsUser(false);
    }
  };
  useEffect(() => {
    checkBuddy();
    checkUserUser();
  }, [setCheckBuddyStatus, user_userId]);

  useEffect(() => {
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
    getUsersPosts();
    getUser();
  }, []);

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
        {!checkIfUserIsUser && (
          <div className="userProfile__addUser">
            {checkBuddyStatus ? (
              <Button
                onClick={() => removeBuddy()}
                variant="contained"
                color="secondary"
              >
                <EmojiPeopleIcon fontSize="large" /> <p>Remove Buddy</p>
              </Button>
            ) : (
              <Button
                onClick={() => addABuddy()}
                variant="contained"
                color="primary"
              >
                <EmojiPeopleIcon fontSize="large" /> <p>add a Buddy</p>
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default UserProfile;
