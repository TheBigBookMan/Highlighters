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
import Image from "next/image";

// !!! fix params shouldnt be null on global for params
const UserBio = ({ params }: Params) => {
  const [user, loading] = useAuthState(auth);
  const userId = params.user;
  const [userInfo, setUserInfo] = useState<User | undefined>();
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isFollowedBy, setIsFollowedBy] = useState<boolean>(false);

  const followedByUser = async () => {
    try {
      if (!userId) return;
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
      if (!userId) return;
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

  const followUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (!loggedInUser) return;
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

  const unfollowUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (!loggedInUser) return;
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
    const updateUser = async () => {
      try {
        const collectionUsersRef = collection(db, "users");
        const q = query(collectionUsersRef, where("googleId", "==", user?.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          let userData;
          snapshot.docs.forEach(async (doc) => {
            userData = doc.data();
            setLoggedInUser({
              dailyPosted: userData.dailyPosted,
              description: userData.description,
              displayName: userData.displayName,
              email: userData.email,
              followedBy: userData.followedBy,
              following: userData.following,
              googleId: userData.googleId,
              id: userData.id,
              image: userData.image,
              monthlyPosted: userData.monthlyPosted,
              weeklyPosted: userData.weeklyPosted,
              yearlyPosted: userData.yearlyPosted,
            });
            const followingData = userData?.following;
            if (followingData.includes(userId)) {
              setIsFollowing(true);
            } else {
              setIsFollowing(false);
            }

            const followedByData = userData?.followedBy;
            if (followedByData.includes(userId)) {
              setIsFollowedBy(true);
            } else {
              setIsFollowedBy(false);
            }
          });
        });
        return unsubscribe;
      } catch (err) {
        console.log(err);
      }
    };

    const getData = async () => {
      try {
        if (!userId) return;
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap) {
          const userData = docSnap.data();
          if (!userData) return;
          setUserInfo({
            dailyPosted: userData.dailyPosted,
            description: userData.description,
            displayName: userData.displayName,
            email: userData.email,
            followedBy: userData.followedBy,
            following: userData.following,
            googleId: userData.googleId,
            id: userData.id,
            image: userData.image,
            monthlyPosted: userData.monthlyPosted,
            weeklyPosted: userData.weeklyPosted,
            yearlyPosted: userData.yearlyPosted,
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (user) {
      updateUser();
      getData();
    }
  }, [user, userId]);

  return (
    <div className="flex gap-4 md:px-16 h-[140px] w-full shadow-xl rounded-xl p-2">
      <Image
        height={20}
        width={20}
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
                <>
                  {userId != loggedInUser?.id && (
                    <button
                      onClick={followUser}
                      className="flex gap-2 items-center bg-teal-500 w-[120px] py-1 px-4 rounded-xl text-white hover:bg-teal-600"
                    >
                      <SlUserFollow />
                      Follow
                    </button>
                  )}
                </>
              )}
              {isFollowedBy && <h1 className="text-sm">Follows You</h1>}
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
