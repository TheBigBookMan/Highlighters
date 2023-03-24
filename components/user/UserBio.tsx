"use client";
import { db } from "@/utils/firebase";
import { doc } from "firebase/firestore";
import { useState, useEffect } from "react";

// !!! fix params shouldnt be null on global for params
const UserBio = ({ params }: Params) => {
  const userId = params.user;
  const [userInfo, setUserInfo] = useState<User | undefined>();

  console.log(userId);
  const getData = async () => {
    try {
      const docRef = doc(db, "users", userId);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (userId) {
      getData();
    }
  }, []);

  console.log(params);
  return (
    <div className="flex gap-4 md:px-16 h-[140px] w-full shadow-xl rounded-xl p-2">
      <h1>Person</h1>
    </div>
  );
};

export default UserBio;
