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
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";
import Image from "next/image";
import { SlUserUnfollow, SlUserFollow } from "react-icons/sl";

const Followers = () => {
  const [user, loading] = useAuthState(auth);
  const [followingData, setFollowingData] = useState<User[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<User>();

  // * Update the users followedBy data with new follower
  const followedByUser = async (userId: string) => {
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

  // * Update the users followedBy data by removing follower
  const unfollowedByUser = async (userId: string) => {
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

  // * Update logged in user database with new user they are following
  const followUser = async (
    e: React.MouseEvent<HTMLButtonElement>,
    userId: string
  ) => {
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
      followedByUser(userId);
    } catch (err) {
      console.log(err);
    }
  };

  // * Update logged in user database by removing person they are following
  const unfollowUser = async (
    e: React.MouseEvent<HTMLButtonElement>,
    userId: string
  ) => {
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
      unfollowedByUser(userId);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // * Update the logged in users state from database
    const updateLoggedInUser = async () => {
      try {
        const collectionRef = collection(db, "users");
        const q = query(collectionRef, where("googleId", "==", user?.uid));
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
          });
        });

        return unsubscribe;
      } catch (err) {
        console.log(err);
      }
    };
    updateLoggedInUser();
  }, [user]);

  useEffect(() => {
    // * Get data of followers from database
    const getData = async () => {
      // if (loading) return;
      // if (!user) return route.push("/auth/login");
      try {
        const collectionRef = collection(db, "users");
        const q = query(
          collectionRef,
          where("following", "array-contains", loggedInUser?.id)
        );
        // todo add in a query for having a friend related id
        const unsubscribe = onSnapshot(q, (snapshot) => {
          let lists: any = [];
          snapshot.docs.forEach(async (doc) => {
            await lists.push({ ...doc.data(), id: doc.id });
          });

          setFollowingData([...lists]);
        });
        return unsubscribe;
      } catch (err) {
        console.log(err);
      }
    };
    if (loggedInUser) {
      getData();
    }
  }, [loggedInUser]);

  return (
    <ul className="flex flex-col gap-2">
      {followingData.map((user) => (
        <li
          key={user.id}
          className="max-w-[600px] h-[80px] border-b p-2 py-4 flex justify-between items-center gap-1"
        >
          <Link href={`/user/${user.id}`} key={user.id}>
            <div className="flex  gap-1">
              <Image
                width={20}
                height={20}
                src={user.image}
                alt={user.displayName}
                className="w-20 h-20 rounded-lg"
              />
              <div className="flex flex-col">
                <h1 className="font-bold text-teal-500">{user.displayName}</h1>
                <p className="overflow-y-auto max-w-[400px] h-[50px] text-sm scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-teal-500 scrollbar-track-gray-200">
                  {user.description}
                </p>
              </div>
            </div>
          </Link>

          {loggedInUser && user.followedBy.includes(loggedInUser.id) ? (
            <button
              onClick={(e) => unfollowUser(e, user.id)}
              className="flex gap-2 items-center bg-red-400 w-[120px] h-[40px] p-1 rounded-xl text-white hover:bg-red-600"
            >
              <SlUserUnfollow />
              Unfollow
            </button>
          ) : (
            <button
              onClick={(e) => followUser(e, user.id)}
              className="flex gap-2 items-center bg-teal-500 w-[120px] h-[40px] p-1 rounded-xl text-white hover:bg-teal-600"
            >
              <SlUserFollow />
              Follow
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Followers;
