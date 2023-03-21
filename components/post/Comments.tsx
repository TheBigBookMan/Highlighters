"use client";
import { db } from "@/utils/firebase";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

const Comments = ({ params }: Params) => {
  const selectedPostId = params?.post;
  const [comments, setComments] = useState<Comment[]>([]);
  console.log(selectedPostId);

  const getData = async () => {
    try {
      const collectionRef = collection(db, "comments");
      const q = query(collectionRef, where("postId", "==", selectedPostId));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let lists: any = [];
        snapshot.docs.forEach(async (doc) => {
          await lists.push({ ...doc.data(), id: doc });
        });
        setComments([...lists]);
      });
      return unsubscribe;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  console.log(comments);

  return (
    <div className="shadow-xl rounded-lg p-2 flex flex-col gap-2">
      <h1 className="font-bold text-teal-500 text-lg">Comments</h1>
      <form className="flex flex-col gap-2">
        <textarea
          className="bg-gray-100 border-2 rounded-lg p-1"
          cols={3}
          rows={3}
          placeholder="Add comment..."
        ></textarea>
        <button className="bg-teal-500 w-[100px] py-2 px-4 rounded-xl text-white hover:bg-teal-600">
          Add
        </button>
      </form>
      {comments.length === 0 ? (
        <h1>No comments...</h1>
      ) : (
        <ul className="flex flex-col gap-2">
          {comments.map((comment) => (
            <li className="border-2 rounded" key={comment.id}>
              <p>{comment.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Comments;
