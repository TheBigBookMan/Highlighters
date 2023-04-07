import { auth, db } from "@/utils/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";
import Image from "next/image";
import { SlUserUnfollow, SlUserFollow } from "react-icons/sl";
import { updateLoggedInUser } from "@/utils/loggedinuser";
import { followUser, unFollowUser } from "@/utils/friends.";

const Followers = () => {
  const [user, loading] = useAuthState(auth);
  const [followingData, setFollowingData] = useState<User[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<User | undefined>();

  useEffect(() => {
    // * Update the logged in users state from database
    if (user) {
      updateLoggedInUser(setLoggedInUser, user?.uid);
    }
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
              onClick={(e) => unFollowUser(e, user.id, loggedInUser)}
              className="flex gap-2 items-center bg-red-400 w-[120px] h-[40px] p-1 rounded-xl text-white hover:bg-red-600"
            >
              <SlUserUnfollow />
              Unfollow
            </button>
          ) : (
            <button
              onClick={(e) => followUser(e, user.id, loggedInUser)}
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
