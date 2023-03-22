"use client";
import { auth } from "@/utils/firebase";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BiEditAlt } from "react-icons/bi";
import { TiTickOutline } from "react-icons/ti";

const Bio = () => {
  const [user, loading] = useAuthState(auth);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  console.log(user);

  const addDescription = (e) => {
    e.preventDefault();
    //? add to user collection description
  };

  return (
    <div className="flex gap-4 md:px-16 h-[140px] w-full shadow-xl rounded-xl p-2">
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <img
            src={user?.photoURL}
            alt={user?.displayName}
            className="w-20 h-20 rounded-full"
          />
          <div className="flex flex-col w-full max-w-[400px]">
            <div className="flex justify-between items-center pr-4">
              <div className="flex flex-col gap-1">
                <h1 className="font-bold">{user?.displayName}</h1>
                <p>200 posts</p>
              </div>
              {editMode ? (
                <TiTickOutline
                  onClick={() => setEditMode(false)}
                  className="text-teal-500 hover:bg-gray-200 hover:text-3xl cursor-pointer hover:rounded-xl text-2xl"
                />
              ) : (
                <BiEditAlt
                  onClick={() => setEditMode(true)}
                  className="text-teal-500 hover:bg-gray-200 hover:text-3xl cursor-pointer hover:rounded-xl text-2xl"
                />
              )}
            </div>
            {!editMode ? (
              <p className="overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-teal-500 scrollbar-track-gray-200">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Maiores quas laborum laboriosam vitae nihil iste hic ad unde
                minima dignissimos quos et, molestias dolore quasi modi
                pariatur. Fugiat excepturi illo modi. Quidem quod doloremque
                sapiente, officia porro adipisci impedit eaque?
              </p>
            ) : (
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                cols={3}
                rows={3}
                className="rounded-lg p-2 bg-gray-200 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-teal-500 scrollbar-track-gray-200 w-full "
              >
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Maiores quas laborum laboriosam vitae nihil iste hic ad unde
                minima dignissimos quos et, molestias dolore quasi modi
                pariatur. Fugiat excepturi illo modi. Quidem quod doloremque
                sapiente, officia porro adipisci impedit eaque?
              </textarea>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Bio;
