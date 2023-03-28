"use client";
import { auth, db } from "@/utils/firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FiThumbsUp } from "react-icons/fi";
import { SlSpeech } from "react-icons/sl";

const Post = ({ params }: Params) => {
  const [user, loading] = useAuthState(auth);
  const postId = params?.post;
  const route = useRouter();
  const [postData, setPostData] = useState<Post | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User | undefined>();

  const getData = async () => {
    try {
      const docRef = doc(db, "posts", postId);
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        setPostData({ ...snapshot.data() });
      });
      // const docSnap = await getDoc(docRef);
      // if (docSnap) {
      //   const docData = docSnap.data();
      //   setPostData({ ...docData });
      // }
      return unsubscribe;
    } catch (err) {
      console.log(err);
    }
  };

  const updateUser = async () => {
    try {
      const collectionUsersRef = collection(db, "users");
      const q = query(collectionUsersRef, where("googleId", "==", user?.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let userData;
        snapshot.docs.forEach(async (doc) => {
          userData = doc.data();
          setLoggedInUser({ ...userData, id: doc.id });
        });
      });
      return unsubscribe;
    } catch (err) {
      console.log(err);
    }
  };

  const likeButton = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "posts", postId);
      const updateLikes = [...postData?.likedByUsers, loggedInUser?.id];

      const updatedDoc = { ...postData, likedByUsers: [...updateLikes] };
      await updateDoc(docRef, updatedDoc);
    } catch (err) {
      console.log(err);
    }
  };

  const unlikeButton = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "posts", postId);
      const currentLikes = postData?.likedByUsers;
      const indexOfId = currentLikes?.indexOf(loggedInUser?.id);
      if (indexOfId === undefined) return;
      currentLikes?.splice(indexOfId, 1);
      const updatedDoc = { ...postData, likedByUsers: [...currentLikes] };
      await updateDoc(docRef, updatedDoc);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
    if (user) {
      updateUser();
    }
  }, [user]);

  return (
    <div className="flex flex-col max-w-[600px]  gap-4 shadow-xl p-2 rounded-lg">
      {postData && loggedInUser && (
        <>
          <div className="flex gap-2 items-center">
            <p>{postData?.timeframe} Highlight:</p>
            <h1 className="font-bold text-xl text-teal-500">
              {postData?.title}
            </h1>
          </div>
          <p>
            Posted by:{" "}
            <Link
              href={`/user/${postData?.userId}`}
              className="text-teal-500 font-bold cursor-pointer"
            >
              {postData?.userName}
            </Link>
          </p>
          <div className="flex gap-6">
            <p>{postData?.date}</p>
            <div className="flex gap-2">
              <div className="flex gap-1 items-center">
                <SlSpeech className="text-xl" />
                <p>{postData?.comments}</p>
              </div>
              <div className="flex gap-1 items-center">
                {postData?.likedByUsers.includes(loggedInUser?.id) ? (
                  <FiThumbsUp
                    onClick={unlikeButton}
                    className="text-lg cursor-pointer text-teal-500 hover:text-black"
                  />
                ) : (
                  <FiThumbsUp
                    onClick={likeButton}
                    className="text-lg cursor-pointer hover:text-teal-500"
                  />
                )}

                <p>{postData?.likedByUsers.length}</p>
              </div>
            </div>
          </div>
          <p>{postData?.location}</p>

          <img
            src={postData?.image}
            className="w-full max-w-[700px] rounded-xl shadow-xl"
          />
          <p>{postData?.description}</p>
        </>
      )}
    </div>
  );
};

export default Post;
