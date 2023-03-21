"use client";
import { auth, db } from "@/utils/firebase";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Comments = ({ params }: Params) => {
  const [user, loading] = useAuthState(auth);
  const selectedPostId = params?.post;
  const [comments, setComments] = useState<Comment[]>([]);
  const [writeComment, setWriteComment] = useState<string>("");
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

  const createComment = async (e) => {
    e.preventDefault();
    if (writeComment === "") {
      toast.error("Need to input a comment.❌");
      return;
    }
    try {
      const collectionRef = collection(db, "comments");
      const newComment = await addDoc(collectionRef, {
        comment: writeComment,
        postId: selectedPostId,
        userName: user?.displayName,
      });
      toast.success("Post successful!✅");
      setWriteComment("");
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
      <ToastContainer limit={1} />
      <h1 className="font-bold text-teal-500 text-lg">Comments</h1>
      <form className="flex flex-col gap-2">
        <textarea
          onChange={(e) => setWriteComment(e.target.value)}
          value={writeComment}
          className="bg-gray-100 border-2 rounded-lg p-1"
          cols={3}
          rows={3}
          placeholder="Add comment..."
        ></textarea>
        <button
          onClick={(e) => createComment(e)}
          className="bg-teal-500 w-[100px] py-2 px-4 rounded-xl text-white hover:bg-teal-600"
        >
          Add
        </button>
      </form>
      {comments.length === 0 ? (
        <h1>No comments...</h1>
      ) : (
        <ul className="flex flex-col gap-2">
          {comments.map((comment, idx) => (
            <li className="border-2 rounded" key={comment.id + idx}>
              <p>{comment.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Comments;
