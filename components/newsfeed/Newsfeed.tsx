"use client";
import { auth, db } from "@/utils/firebase";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { HiThumbDown, HiThumbUp } from "react-icons/hi";
import { SlSpeech } from "react-icons/sl";
import { useRouter } from "next/navigation";
import {
  collection,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import { userFilter } from "@/utils/filterposts";
const hardcode = ["All", "Daily", "Weekly", "Monthly", "Yearly"];

//? use this to get the database newsfeed stuff

const Newsfeed = () => {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [newsfeedData, setNewsfeedData] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [timeframe, setTimeframe] = useState<string>("All");
  const [selectedFilter, setSelectedFilter] = useState<string>("Most Recent");
  const [followingData, setFollowingData] = useState<string[]>([]);

  useEffect(() => {
    const getUsersFollowingList = async () => {
      try {
        const collectionRef = collection(db, "users");
        const q = query(collectionRef, where("googleId", "==", user?.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
          let userData;
          snapshot.docs.forEach(async (doc) => {
            userData = doc.data();
          });
          if (!userData) return;
          setFollowingData([...userData?.following]);
        });
        return unsubscribe;
      } catch (err) {
        console.log(err);
      }
    };
    if (user) {
      getUsersFollowingList();
    }
  }, [user, loading]);

  useEffect(() => {
    const getData = async () => {
      // if (loading) return;
      // if (!user) return route.push("/auth/login");
      try {
        const collectionRef = collection(db, "posts");
        const q = query(
          collectionRef,
          where("userId", "in", followingData),
          orderBy("createdAt", "desc")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
          let lists: any = [];
          snapshot.docs.forEach(async (doc) => {
            await lists.push({ ...doc.data(), id: doc.id });
          });

          setNewsfeedData([...lists]);
          setFilteredPosts([...lists]);
        });
        return unsubscribe;
      } catch (err) {
        console.log(err);
      }
    };
    if (followingData.length > 0) {
      getData();
    }
  }, [followingData]);

  useEffect(() => {
    const filteredTimeframe = async () => {
      if (newsfeedData.length > 0) {
        if (timeframe === "All") {
          const userList = await userFilter(newsfeedData, selectedFilter);
          setFilteredPosts([...userList]);
        } else {
          const filteredList = newsfeedData.filter((post) => {
            return post.timeframe === timeframe;
          });
          const userList = await userFilter(filteredList, selectedFilter);
          setFilteredPosts([...userList]);
        }
      }
    };
    filteredTimeframe();
  }, [timeframe, selectedFilter, newsfeedData]);

  return (
    <div className="shadow-xl rounded-lg h-full w-full p-4 flex flex-col gap-4">
      <div className="flex gap-2">
        <h1 className="font-bold text-2xl text-teal-500">Newsfeed</h1>
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
      <ul className="flex gap-2 border-b">
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

      <ul className="flex flex-wrap justify-center sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPosts?.map((post, idx) => (
          <Link key={post.id + idx} href={`/post/${post?.id}`}>
            <li className="flex flex-col shadow-xl rounded-lg p-2 items-center gap-2 max-h-[600px] w-[300px] group hover:bg-teal-100 cursor-pointer">
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-60 h-60 rounded-lg"
                />
              )}
              <h1 className="font-bold text-teal-500">{post.title}</h1>
              <h1>
                Posted by:{" "}
                <span className="font-bold text-teal-500">{post.userName}</span>
              </h1>
              <p>{post.date}</p>

              <div className="flex gap-4">
                <div className="flex gap-1 items-center">
                  <SlSpeech className="text-xl" />
                  <p>{post.comments.length}</p>
                </div>
                <div className="flex gap-1 items-center">
                  {/* if the post has the user clicking on dislike then render the colored one- HiThumbUp */}
                  <FiThumbsUp className="text-lg hover:text-teal-500 cursor-pointer" />
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
    </div>
  );
};

export default Newsfeed;
