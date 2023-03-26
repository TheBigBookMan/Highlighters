"use client";
import { db } from "@/utils/firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { SlUserFollow, SlUserUnfollow } from "react-icons/sl";
import { auth } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

// !!! fix params shouldnt be null on global for params
const UserBio = ({ params }: Params) => {
  const [user, loading] = useAuthState(auth);
  const userId = params.user;
  const [userInfo, setUserInfo] = useState<User | undefined>();
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const getData = async () => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap) {
        const docData = docSnap.data();
        setUserInfo({ ...docData });
      }
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
          const followingData = userData?.following;
          if (followingData.includes(userId)) {
            setIsFollowing(true);
          } else {
            setIsFollowing(false);
          }
          setLoggedInUser({ ...userData, id: doc.id });
        });
      });
      return unsubscribe;
    } catch (err) {
      console.log(err);
    }
  };

  const followedByUser = async () => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      const userInfo = docSnap.data();
      const userFollowedBy = userInfo?.followedBy;
      const updatedFollowedBy = {
        ...userInfo,
        followedBy: [...userFollowedBy, loggedInUser?.id],
      };
      await updateDoc(docRef, updatedFollowedBy);
    } catch (err) {
      console.log(err);
    }
  };

  const unfollowedByUser = async () => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      const userInfo = docSnap.data();
      const userFollowedBy = userInfo?.followedBy;
      const idIndex = userFollowedBy.indexOf(loggedInUser?.id);
      userFollowedBy.splice(idIndex, 1);
      const updatedInfo = { ...userInfo, followedBy: [...userFollowedBy] };
      await updateDoc(docRef, updatedInfo);
    } catch (err) {
      console.log(err);
    }
  };

  const followUser = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "users", loggedInUser?.id);
      const docSnap = await getDoc(docRef);
      const userInfo = docSnap.data();
      const userFollowing = userInfo?.following;
      const updatedFollowing = {
        ...loggedInUser,
        following: [...userFollowing, userId],
      };
      await updateDoc(docRef, updatedFollowing);
      followedByUser();
    } catch (err) {
      console.log(err);
    }
  };

  const unfollowUser = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "users", loggedInUser?.id);
      const docSnap = await getDoc(docRef);
      const userInfo = docSnap.data();
      const userFollowing = userInfo?.following;
      const idIndex = userFollowing.indexOf(userId);
      userFollowing.splice(idIndex, 1);
      const updatedInfo = {
        ...loggedInUser,
        following: [...userFollowing],
      };
      await updateDoc(docRef, updatedInfo);
      unfollowedByUser();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (userId) {
      getData();
    }
    if (user) {
      updateUser();
    }
  }, [user]);

  return (
    <div className="flex gap-4 md:px-16 h-[140px] w-full shadow-xl rounded-xl p-2">
      <img
        src={userInfo?.image}
        alt={userInfo?.displayName}
        className="w-20 h-20 rounded-full"
      />
      <div className="flex flex-col w-full max-w-[400px]">
        <div className="flex justify-between items-center pr-4">
          <div className="flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              <h1 className="font-bold text-teal-500">
                {userInfo?.displayName}
              </h1>
              {isFollowing ? (
                <button
                  onClick={unfollowUser}
                  className="flex gap-2 items-center bg-red-400 w-[120px] py-1 px-4 rounded-xl text-white hover:bg-red-600"
                >
                  <SlUserUnfollow />
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={followUser}
                  className="flex gap-2 items-center bg-teal-500 w-[120px] py-1 px-4 rounded-xl text-white hover:bg-teal-600"
                >
                  <SlUserFollow />
                  Follow
                </button>
              )}
            </div>
            <p
              className={`overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-teal-500 scrollbar-track-gray-200`}
            >
              {userInfo?.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBio;
