"use client";
import { auth, db } from "@/utils/firebase";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { HiThumbDown, HiThumbUp } from "react-icons/hi";
import { SlSpeech } from "react-icons/sl";
import { useRouter } from "next/navigation";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Link from "next/link";
const hardcode = ["All", "Daily", "Weekly", "Monthly", "Yearly"];

//? use this to get the database newsfeed stuff

const Newsfeed = () => {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [newsfeedData, setNewsfeedData] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [timeframe, setTimeframe] = useState<string>("All");

  const filteredTimeframe = () => {
    if (newsfeedData.length > 0) {
      if (timeframe === "All") {
        setFilteredPosts([...newsfeedData]);
      } else {
        const filteredList = newsfeedData.filter((post) => {
          return post.timeframe === timeframe;
        });
        setFilteredPosts([...filteredList]);
      }
    }
  };

  const getData = async () => {
    // if (loading) return;
    // if (!user) return route.push("/auth/login");
    try {
      const collectionRef = collection(db, "posts");
      const q = query(collectionRef, orderBy("createdAt", "desc"));
      // todo add in a query for having a friend related id
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

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    filteredTimeframe();
  }, [timeframe]);

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
        {filteredPosts?.map((post, idx) => (
          <Link key={post.id + idx} href={`/post/${post?.id}`}>
            <li
              // onClick={() => route.push(`/post/${post?.id}`)}
              className="flex flex-col shadow-xl rounded-lg p-2 items-center gap-2 max-h-[600px] w-[300px] group hover:bg-teal-100 cursor-pointer"
            >
              {/* !! might need to add in a ternary for if there is no photo and just leave blank without an image */}
              <img
                src={post.image}
                alt={post.title}
                className="w-60 h-60 rounded-lg"
              />
              <h1 className="font-bold text-teal-500">{post.title}</h1>
              <h1>
                Posted by:{" "}
                <span className="font-bold text-teal-500">{post.userName}</span>
              </h1>
              <p>{post.date}</p>

              <div className="flex gap-4">
                <div className="flex gap-1 items-center">
                  <SlSpeech className="text-xl" />
                  <p>{post.comments}</p>
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
