"use client";
import { auth, db } from "@/utils/firebase";
import { likeButton, unlikeButton } from "@/utils/getdata";
import { updateLoggedInUser } from "@/utils/loggedinuser";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FiThumbsUp } from "react-icons/fi";
import { SlSpeech } from "react-icons/sl";

const Post = ({ params }: Params) => {
  const [user, loading] = useAuthState(auth);
  const postId = params?.post;
  const [postData, setPostData] = useState<Post | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User | undefined>();

  useEffect(() => {
    // * Get data about post from database
    const getData = async () => {
      try {
        if (!postId) return;
        const docRef = doc(db, "posts", postId);
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
          let postData = snapshot.data();
          if (postData) {
            setPostData({
              title: postData.title,
              image: postData.image,
              description: postData.description,
              location: postData.location,
              date: postData.date,
              timeframe: postData.timeframe,
              userId: postData.userId,
              googleId: postData.googleId,
              likedByUsers: postData.likedByUsers,
              comments: postData.comments,
              userName: postData.userName,
              createdAt: postData.createdAt,
              friends: postData.friends,
              id: postId,
            });
          }
        });
        return unsubscribe;
      } catch (err) {
        console.log(err);
      }
    };

    getData();
    // * Set state for logged in user
    if (user) {
      updateLoggedInUser(setLoggedInUser, user?.uid);
    }
  }, [user, postId]);

  return (
    <div className="flex flex-col max-w-[600px]  gap-4 shadow-xl p-2 rounded-lg">
      {postData && loggedInUser && (
        <>
          <div className="flex gap-2 items-center">
            <p>{postData?.timeframe} Highlight:</p>
            <h1 className="font-bold text-teal-500">{postData?.title}</h1>
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
                <p>{postData?.comments.length}</p>
              </div>
              <div className="flex gap-1 items-center">
                {postData?.likedByUsers.includes(loggedInUser?.id) ? (
                  <button
                    onClick={(e) =>
                      unlikeButton(e, "posts", postId, loggedInUser.id)
                    }
                  >
                    <FiThumbsUp className="text-lg cursor-pointer text-teal-500 hover:text-black" />
                  </button>
                ) : (
                  <button
                    onClick={(e) =>
                      likeButton(e, "posts", postId, loggedInUser.id)
                    }
                  >
                    <FiThumbsUp className="text-lg cursor-pointer hover:text-teal-500" />
                  </button>
                )}

                <p>{postData?.likedByUsers.length}</p>
              </div>
            </div>
          </div>
          <p>{postData?.location}</p>

          <Image
            height={80}
            width={80}
            src={postData?.image}
            alt={postData.title}
            className="w-full max-w-[700px] rounded-xl shadow-xl"
          />
          <p>{postData?.description}</p>
        </>
      )}
    </div>
  );
};

export default Post;
