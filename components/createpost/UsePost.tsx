"use client";
import { auth, db } from "@/utils/firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const UsePost = (loggedInUser: User | null) => {
  const [user, loading] = useAuthState(auth);
  const userId = loggedInUser?.id;
  const [selectedPost, setSelectedPost] = useState<string>();
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("Daily");
  const [selectedUploadTimeframe, setSelectedUploadTimeframe] =
    useState<string>("Weekly");
  const [usersPosts, setUsersPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  const filteredTimeframe = async () => {
    if (usersPosts.length > 0) {
      const filteredList = usersPosts.filter((post) => {
        return post.timeframe === selectedTimeframe;
      });

      setFilteredPosts([...filteredList]);
    }
  };

  const getData = async () => {
    try {
      const collectionRef = collection(db, "posts");
      const q = query(collectionRef, where("googleId", "==", user?.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let userData: any = [];
        snapshot.docs.forEach(async (doc) => {
          userData.push({ ...doc.data(), id: doc.id });
        });
        const filteredList = userData.filter((post: any) => {
          return post.timeframe === "Daily";
        });
        setUsersPosts([...userData]);
        setFilteredPosts([...filteredList]);
      });
      return unsubscribe;
    } catch (err) {
      console.log(err);
    }
  };

  const updatePostTimeframe = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "posts", selectedPost);
      const docSnap = await getDoc(docRef);
      if (!docSnap) return;
      const docData = docSnap.data();
      const updatedData = { ...docData, timeframe: selectedUploadTimeframe };
      await updateDoc(docRef, updatedData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user) {
      getData();
    }
  }, [user]);

  useEffect(() => {
    filteredTimeframe();
  }, [selectedTimeframe]);

  return (
    <div className="shadow-xl rounded-lg flex flex-col gap-2 p-2">
      <h1 className="font-bold text-teal-500 text-xl">Use Created Highlight</h1>
      <p>Use an already made highlight for a new timeframe.</p>
      <form className="flex flex-col gap-2">
        <h1 className="font-bold text-teal-500">Timeframe:</h1>
        <select
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          className="w-full"
          value={selectedTimeframe}
        >
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
        <h1 className="font-bold text-teal-500">Select Post</h1>
        <select
          onChange={(e) => setSelectedPost(e.target.value)}
          className="w-full"
          // value={selectedPost}
        >
          {filteredPosts?.map((post) => (
            <option value={post.id}>{post.title}</option>
          ))}
        </select>
        <h1 className="font-bold text-teal-500">
          Select Timeframe To Upload To:
        </h1>
        <select
          value={selectedUploadTimeframe}
          onChange={(e) => setSelectedUploadTimeframe(e.target.value)}
          className="w-full"
        >
          <option value="Weekly" disabled={loggedInUser?.weeklyPosted === true}>
            Weekly
          </option>
          <option
            value="Monthly"
            disabled={loggedInUser?.monthlyPosted === true}
          >
            Monthly
          </option>
          <option value="Yearly" disabled={loggedInUser?.yearlyPosted === true}>
            Yearly
          </option>
        </select>
        <button
          onClick={(e) => updatePostTimeframe(e)}
          className="bg-teal-500 py-2 px-4 rounded-xl text-white hover:bg-teal-600"
        >
          Select
        </button>
      </form>
    </div>
  );
};

export default UsePost;
