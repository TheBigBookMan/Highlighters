"use client";

const hardcode = ["Daily", "Weekly", "Monthly", "Yearly"];
import { useState, useEffect } from "react";
import { auth, db } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { SlSpeech } from "react-icons/sl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Link from "next/link";
import { postsData } from "@/utils/getdata";

const UserPosts = ({ params }: Params) => {
  const userId = params?.user;
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [timeframe, setTimeframe] = useState<string>("Daily");
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  useEffect(() => {
    // * Get data for the users posts
    if (user && userId) {
      postsData("posts", "userId", "==", userId, setPosts, setFilteredPosts);
    }
  }, [user, loading, route, userId]);

  useEffect(() => {
    // * Set state for selected filter
    const filteredTimeframe = () => {
      if (posts.length > 0) {
        const filteredList = posts.filter((post) => {
          return post.timeframe === timeframe;
        });
        setFilteredPosts([...filteredList]);
      }
    };

    filteredTimeframe();
  }, [timeframe, posts]);

  return (
    <div className="shadow-xl rounded-lg h-full w-full p-4 flex flex-col gap-4">
      <div className="flex flex-col border-b">
        <h1 className="font-bold text-2xl text-teal-500">Posts</h1>
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
      {userId && (
        <ul className="flex flex-wrap justify-center sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPosts.length === 0 && (
            <h1 className="font-bold text-teal-500">
              Create Highlights to view them on your profile!
            </h1>
          )}
          {filteredPosts?.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`}>
              <li className="group hover:bg-teal-100 cursor-pointer transition flex flex-col shadow-xl rounded-lg p-2 items-center gap-2 max-h-[600px] w-[300px]">
                {/* !! might need to add in a ternary for if there is no photo and just leave blank without an image */}
                {post.image && (
                  <Image
                    height={60}
                    width={60}
                    src={post.image}
                    alt={post.title}
                    className="w-60 h-60"
                  />
                )}
                <h1 className="font-bold text-teal-500">{post.title}</h1>
                <p className="text-sm">{post.date}</p>
                <div className="flex items-center gap-4">
                  <div className="flex gap-1 items-center">
                    <SlSpeech className="text-xl" />
                    <p>{post.comments.length}</p>
                  </div>
                  <div className="flex gap-1 items-center">
                    <FiThumbsUp className="text-lg " />
                    <p>{post.likedByUsers.length}</p>
                  </div>
                </div>
                <p className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-teal-500 scrollbar-track-gray-200">
                  {post.description}
                </p>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserPosts;
