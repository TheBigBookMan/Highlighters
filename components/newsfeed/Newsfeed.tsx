"use client";

import { auth } from "@/utils/firebase";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { HiThumbDown, HiThumbUp } from "react-icons/hi";
import { SlSpeech } from "react-icons/sl";
const hardcode = ["All", "Daily", "Weekly", "Monthly", "Yearly"];

//? use this to get the database newsfeed stuff

const Newsfeed = () => {
  const [user, loading] = useAuthState(auth);
  const [timeframe, setTimeframe] = useState<string>("All");

  return (
    <div className="shadow-xl rounded-lg h-full w-full p-4 flex flex-col gap-4">
      <div className="flex flex-col border-b">
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
      <ul className="flex flex-wrap justify-center sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <li className="flex flex-col shadow-xl rounded-lg p-2 items-center gap-2 max-h-[600px] w-[300px]">
          {/* !! might need to add in a ternary for if there is no photo and just leave blank without an image */}
          <img src={user?.photoURL} alt="pic" className="w-60 h-60" />
          <h1 className="font-bold text-teal-500">Hiking the amazon</h1>
          <h1>
            Posted by:{" "}
            <span className="font-bold text-teal-500">ANdy Kyrakou</span>
          </h1>
          <p>23/03/2021</p>

          <div className="flex gap-4">
            <div className="flex gap-1 items-center">
              <SlSpeech className="text-xl cursor-pointer hover:text-teal-500" />
              <p>435</p>
            </div>
            <div className="flex gap-1 items-center">
              {/* if the post has the user clicking on dislike then render the colored one- HiThumbUp */}
              <FiThumbsUp className="text-lg hover:text-teal-500 cursor-pointer" />
              <p>234</p>
            </div>
            <div className="flex gap-1 items-center">
              {/* if the post has the user clicking on dislike then render the colored one- HiThumbDown */}
              <FiThumbsDown className="text-lg hover:text-teal-500 cursor-pointer" />
              <p>234</p>
            </div>
          </div>
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
    </div>
  );
};

export default Newsfeed;
