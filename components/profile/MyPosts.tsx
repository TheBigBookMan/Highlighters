"use client";

const hardcode = ["Daily", "Weekly", "Monthly", "Yearly"];
import { useState, useEffect } from "react";

const MyPosts = () => {
  const [timeframe, setTimeframe] = useState<string>("Daily");

  return (
    <div className="shadow-xl rounded-lg h-full w-full p-4 flex flex-col">
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
  );
};

export default MyPosts;
