"use client";
import { db } from "@/utils/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { SlSpeech } from "react-icons/sl";

const Post = ({ params }: Params) => {
  const postId = params?.post;
  const route = useRouter();
  const [postData, setPostData] = useState<Post | null>(null);

  const getData = async () => {
    try {
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);
      if (docSnap) {
        const docData = docSnap.data();
        setPostData({ ...docData });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  //!!!
  //!! make the comments in bottom and then when larger screen put to the right
  //!!

  return (
    <div className="flex flex-col gap-4 shadow-xl p-2 rounded-lg">
      <div className="flex gap-2 items-center">
        <p>{postData?.timeframe} Highlight:</p>
        <h1 className="font-bold text-xl text-teal-500">{postData?.title}</h1>
      </div>
      <p>Posted by: {postData?.userName}</p>
      <div className="flex gap-6">
        <p>{postData?.date}</p>
        <div className="flex gap-2">
          <div className="flex gap-1 items-center">
            <SlSpeech className="text-xl" />
            <p>{postData?.comments}</p>
          </div>
          <div className="flex gap-1 items-center">
            <FiThumbsUp className="text-lg " />
            <p>{postData?.likes}</p>
          </div>
          <div className="flex gap-1 items-center">
            <FiThumbsDown className="text-lg " />
            <p>{postData?.dislikes}</p>
          </div>
        </div>
      </div>
      <p>{postData?.location}</p>

      <img
        src={postData?.image}
        className="w-full max-w-[700px] rounded-xl shadow-xl"
      />
      <p>{postData?.description}</p>
    </div>
  );
};

export default Post;
