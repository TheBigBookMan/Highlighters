"use client";

const hardcode = ["Daily", "Weekly", "Monthly", "Yearly"];
import { useState, useEffect } from "react";
import { auth, db } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { SlSpeech } from "react-icons/sl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import { userFilter } from "@/utils/filterposts";

const MyPosts = () => {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [timeframe, setTimeframe] = useState<string>("Daily");
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("Most Recent");

  const filteredTimeframe = async () => {
    if (posts.length > 0) {
      const filteredList = posts.filter((post) => {
        return post.timeframe === timeframe;
      });
      const returnFilteredLists = await userFilter(
        filteredList,
        selectedFilter
      );
      setFilteredPosts([...returnFilteredLists]);
    }
  };

  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth");

    try {
      const collectionRef = collection(db, "posts");
      const q = query(
        collectionRef,
        where("googleId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let lists: any = [];
        snapshot.docs.forEach(async (doc) => {
          await lists.push({ ...doc.data(), id: doc.id });
        });
        const filteredList = lists.filter((post: any) => {
          return post.timeframe === "Daily";
        });
        setPosts([...lists]);
        setFilteredPosts([...filteredList]);
      });
      return unsubscribe;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, [user]);

  useEffect(() => {
    filteredTimeframe();
  }, [timeframe, selectedFilter]);

  return (
    <div className="shadow-xl rounded-lg h-full w-full p-4 flex flex-col gap-4">
      <div className="flex flex-col border-b">
        <div className="flex gap-2">
          <h1 className="font-bold text-2xl text-teal-500">My Posts</h1>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="bg-gray-200 rounded-xl"
          >
            <option value="Most Recent">Most Recent</option>
            <option value="Least Recent">Least Recent</option>
            <option value="Top Rated">Top Rated</option>
            <option value="Least Rated">Least Rated</option>
          </select>
        </div>
        <ul className="flex gap-2">
          {hardcode.map((time) => (
            <li
              onClick={() => {
                setSelectedFilter("Most Recent");
                setTimeframe(time);
              }}
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
          {filteredPosts.length === 0 && (
            <h1 className="font-bold text-teal-500">
              Create Highlights to view them on your profile!
            </h1>
          )}
          {filteredPosts?.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`}>
              <li className="group hover:bg-teal-100 cursor-pointer transition flex flex-col shadow-xl rounded-lg p-2 items-center gap-2 max-h-[600px] w-[300px]">
                {/* !! might need to add in a ternary for if there is no photo and just leave blank without an image */}
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-60 h-60 rounded-lg"
                />
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

export default MyPosts;
