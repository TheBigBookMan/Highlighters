import { auth, db } from "@/utils/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";

const Following = () => {
  const [user, loading] = useAuthState(auth);
  const [followingData, setFollowingData] = useState<User[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<User>();

  const updateLoggedInUser = async () => {
    try {
      const collectionRef = collection(db, "users");
      const q = query(collectionRef, where("googleId", "==", user?.uid));
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
  console.log(followingData);

  useEffect(() => {
    updateLoggedInUser();
  }, [user]);

  useEffect(() => {
    if (loggedInUser) {
      getData();
    }
  }, [loggedInUser]);

  return (
    <ul className="flex flex-col gap-2">
      {followingData.map((user) => (
        <Link
          href={`/user/${user.id}`}
          key={user.id}
          className="max-w-[400px] border-b p-1 flex gap-1"
        >
          <img
            src={user.image}
            alt={user.displayName}
            className="w-20 h-20 rounded-lg"
          />
          <div className="flex flex-col">
            <h1 className="font-bold text-teal-500">{user.displayName}</h1>
            <p className="overflow-y-auto">{user.description}</p>
          </div>
        </Link>
      ))}
    </ul>
  );
};

export default Following;
