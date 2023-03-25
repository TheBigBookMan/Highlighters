"use client";
import { auth, db } from "@/utils/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Comments = ({ params }: Params) => {
  const [user, loading] = useAuthState(auth);
  const selectedPostId = params?.post;
  const [comments, setComments] = useState<Comment[]>([]);
  const [writeComment, setWriteComment] = useState<string>("");
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

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

  const updateCommentCount = async () => {
    try {
      const docRef = doc(db, "posts", selectedPostId);
      const docSnap = await getDoc(docRef);
      console.log(docSnap.data());

      const commentData = docSnap.data();
      const updatedPost = {
        ...commentData,
        comments: commentData.comments + 1,
      };

      await updateDoc(docRef, updatedPost);
    } catch (err) {
      console.log(err);
    }
  };

  const updateUser = async () => {
    try {
      const collectionUsersRef = collection(db, "users");
      const q = query(collectionUsersRef, where("googleId", "==", user?.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let userData;
        snapshot.docs.forEach(async (doc) => {
          userData = doc.data();
          setLoggedInUser({ ...userData, id: doc.id });
        });
      });
      return unsubscribe;
    } catch (err) {
      console.log(err);
    }
  };

  const createComment = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (writeComment === "") {
      toast.error("Need to input a comment.❌");
      return;
    }
    try {
      let today: Date | string = new Date();
      today = today.toLocaleDateString();
      const collectionRef = collection(db, "comments");
      const newComment = await addDoc(collectionRef, {
        comment: writeComment,
        postId: selectedPostId,
        userName: user?.displayName,
        userImage: user?.photoURL,
        date: today,
        userId: loggedInUser?.id,
      });
      toast.success("Post successful!✅");
      setWriteComment("");
      updateCommentCount();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
    if (user) {
      updateUser();
    }
  }, [user]);

  return (
    <div className="shadow-xl rounded-lg max-w-[600px]  p-2 flex flex-col gap-2">
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
        <ul className="flex flex-col gap-2 h-[540px] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-teal-500 scrollbar-track-gray-200">
          {comments.map((comment, idx) => (
            <li
              className="border-2 rounded h-[100px]  flex gap-2 break-words"
              key={comment.id + idx}
            >
              <Link
                className="h-full  rounded"
                href={`/user/${comment.userId}`}
              >
                <img
                  src={comment.userImage}
                  alt={comment.userName}
                  className="h-full min-w-[100px] rounded"
                />
              </Link>
              <div className="flex flex-col">
                <div className="flex  gap-4 items-center">
                  <h1 className="font-bold text-teal-500">
                    {comment.userName}
                  </h1>
                  <p className="text-sm">{comment.date}</p>
                </div>
                <p className="overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-teal-500 scrollbar-track-gray-200">
                  {comment.comment}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Comments;
