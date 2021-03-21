import { db } from "../lib/firebase";
export const likeHandler = (id, username) => {
  db.collection("posts")
    .doc(id)
    .set(
      {
        likes: [username],
      },
      { merge: true }
    );
};
