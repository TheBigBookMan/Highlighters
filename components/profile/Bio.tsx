"use client";
import { auth } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";

const Bio = () => {
  const [user, loading] = useAuthState(auth);

  return (
    <div className="flex h-[140px] w-full ">
      <img
        src={user?.photoURL}
        alt={user?.displayName}
        className="w-20 h-20 rounded-full"
      />
      <div className="flex flex-col">
        <h1>{user?.displayName}</h1>
        <p>200 posts</p>
      </div>
    </div>
  );
};

export default Bio;
