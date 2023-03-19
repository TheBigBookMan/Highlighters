"use client";
import { auth } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";

const Bio = () => {
  const [user, loading] = useAuthState(auth);

  return (
    <div className="flex gap-4 h-[140px] w-full shadow-xl rounded-xl p-2">
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <img
            src={user?.photoURL}
            alt={user?.displayName}
            className="w-20 h-20 rounded-full"
          />
          <div className="flex flex-col">
            <h1 className="font-bold">{user?.displayName}</h1>
            <p>200 posts</p>
            <p className="overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-teal-500 scrollbar-track-gray-200">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maiores
              quas laborum laboriosam vitae nihil iste hic ad unde minima
              dignissimos quos et, molestias dolore quasi modi pariatur. Fugiat
              excepturi illo modi. Quidem quod doloremque sapiente, officia
              porro adipisci impedit eaque?
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Bio;
