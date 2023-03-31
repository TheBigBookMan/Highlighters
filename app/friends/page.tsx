"use client";
import { useState } from "react";
import Followers from "@/components/friends/Followers";
import Following from "@/components/friends/Following";

const FriendsPage = () => {
  const [selectedFriends, setSelectedFriends] = useState<string>("Following");

  return (
    <div className="shadow-xl rounded-lg h-full w-full p-4 flex flex-col gap-4">
      <h1 className="font-bold text-teal-500 text-xl">Friends</h1>
      <ul className="flex gap-2 w-full border-b">
        <li
          onClick={() => setSelectedFriends("Following")}
          className={`cursor-pointer ${
            selectedFriends === "Following" && "text-teal-500 font-bold"
          }`}
        >
          Following
        </li>
        <li
          onClick={() => setSelectedFriends("Followers")}
          className={`cursor-pointer ${
            selectedFriends === "Followers" && "text-teal-500 font-bold"
          }`}
        >
          Followers
        </li>
      </ul>
      {selectedFriends === "Following" ? <Following /> : <Followers />}
    </div>
  );
};

export default FriendsPage;
