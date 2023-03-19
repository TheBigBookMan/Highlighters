"use client";

const hardcode = ["Daily", "Weekly", "Monthly", "Yearly"];
import { useState, useEffect } from "react";
import { auth } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";

const MyPosts = () => {
  const [user, loading] = useAuthState(auth);
  const [timeframe, setTimeframe] = useState<string>("Daily");

  return (
    <div className="shadow-xl rounded-lg h-full w-full p-4 flex flex-col gap-4">
      <div className="flex flex-col border-b">
        <h1 className="font-bold text-2xl text-teal-500">My Posts</h1>
        <ul className="flex gap-2">
          {hardcode.map((time) => (
            <li
              onClick={() => setTimeframe(time)}
              key={time}
              className={`${
                timeframe === time && "font-bold text-teal-500"
              } cursor-pointer`}
            >
              {time}
            </li>
          ))}
        </ul>
      </div>
      {user && (
        <ul className="flex flex-wrap justify-center sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <li className="flex flex-col shadow-xl rounded-lg p-2 items-center gap-2 max-h-[600px] w-[300px]">
            {/* !! might need to add in a ternary for if there is no photo and just leave blank without an image */}
            <img src={user?.photoURL} alt="pic" className="w-60 h-60" />
            <h1 className="font-bold text-teal-500">Hiking the amazon</h1>
            <p>23/03/2021</p>
            <p className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-teal-500 scrollbar-track-gray-200">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
              corporis, incidunt voluptates esse aspernatur hic suscipit, quos
              commodi sint officiis labore autem, doloribus magni consequatur!
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
              corporis, incidunt voluptates esse aspernatur hic suscipit, quos
              commodi sint officiis labore autem, doloribus magni consequatur!
            </p>
          </li>
        </ul>
      )}
    </div>
  );
};

export default MyPosts;
