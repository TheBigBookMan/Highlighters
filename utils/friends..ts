import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

// * Update logged in user database with new user they are following
export const followUser = async (
  e: React.MouseEvent<HTMLButtonElement>,
  userId: string,
  loggedInUser: User | undefined
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
    followedByUser(userId, loggedInUser);
  } catch (err) {
    console.log(err);
  }
};

// * Update logged in user database by removing person they are following
export const unFollowUser = async (
  e: React.MouseEvent<HTMLButtonElement>,
  userId: string,
  loggedInUser: User | undefined
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
    unFollowedByUser(userId, loggedInUser);
  } catch (err) {
    console.log(err);
  }
};

// * Update the users followedBy data by removing follower
export const unFollowedByUser = async (userId: string, loggedInUser: User) => {
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

// * Update the users followedBy data with new follower
export const followedByUser = async (userId: string, loggedInUser: User) => {
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
