"use client";
import { auth, db } from "@/utils/firebase";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BiEditAlt } from "react-icons/bi";
import { TiTickOutline } from "react-icons/ti";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { Circles } from "react-loader-spinner";
import { updateLoggedInUser } from "@/utils/loggedinuser";

const Bio = () => {
  const [user, loading] = useAuthState(auth);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [loggedInUser, setLoggedInUser] = useState<User>();

  // * Add description to user
  const addDescription = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (!loggedInUser) return;
      const docRef = doc(db, "users", loggedInUser?.id);
      const updatedData = { ...loggedInUser, description };
      await updateDoc(docRef, updatedData);
      toast.success("Descripton updated");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // * Update state for logged in user
    if (user) {
      updateLoggedInUser(setLoggedInUser, user?.uid);
    }
  }, [user]);

  return (
    <div className="flex gap-4 md:px-16 h-[140px] w-full shadow-xl rounded-xl p-2">
      <ToastContainer limit={1} />
      {loading ? (
        <Circles
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      ) : (
        <>
          {user?.photoURL && user.displayName && (
            <Image
              height={20}
              width={20}
              src={user?.photoURL}
              alt={user?.displayName}
              className="w-20 h-20 rounded-full"
            />
          )}
          <div className="flex flex-col w-full max-w-[400px]">
            <div className="flex justify-between items-center pr-4">
              <div className="flex flex-col gap-1">
                <h1 className="font-bold text-teal-500">{user?.displayName}</h1>
              </div>
              {editMode ? (
                <button
                  onClick={(e) => {
                    setEditMode(false);
                    addDescription(e);
                  }}
                >
                  <TiTickOutline className="text-teal-500 hover:bg-gray-200 hover:text-3xl cursor-pointer hover:rounded-xl text-2xl" />
                </button>
              ) : (
                <button onClick={() => setEditMode(true)}>
                  <BiEditAlt className="text-teal-500 hover:bg-gray-200 hover:text-3xl cursor-pointer hover:rounded-xl text-2xl" />
                </button>
              )}
            </div>
            {!editMode ? (
              <p
                className={`overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-teal-500 scrollbar-track-gray-200 ${
                  !loggedInUser?.description && "text-gray-400"
                }`}
              >
                {!loggedInUser?.description
                  ? "Insert description..."
                  : loggedInUser.description}
              </p>
            ) : (
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                cols={3}
                rows={3}
                className="rounded-lg p-2 bg-gray-200 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-teal-500 scrollbar-track-gray-200 w-full "
              >
                {!loggedInUser?.description
                  ? "Insert description..."
                  : loggedInUser.description}
              </textarea>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Bio;
