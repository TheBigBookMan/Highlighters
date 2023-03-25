"use client";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

// !!! fix params shouldnt be null on global for params
const UserBio = ({ params }: Params) => {
  const userId = params.user;
  const [userInfo, setUserInfo] = useState<User | undefined>();

  console.log(userId);
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

  useEffect(() => {
    if (userId) {
      getData();
    }
  }, []);

  console.log(userInfo);
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
            <h1 className="font-bold">{userInfo?.displayName}</h1>

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
