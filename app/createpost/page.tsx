"use client";
import {
  ChangeEvent,
  FormEvent,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import { toast, ToastContainer } from "react-toastify";
import UsePost from "@/components/createpost/UsePost";

import { db, storage, auth } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import "react-toastify/dist/ReactToastify.css";
import {
  Timestamp,
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

const CreatePostPage = () => {
  const [user, loading] = useAuthState(auth);
  const [imageChosen, setImageChosen] = useState<ImageFile | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [postForm, setPostForm] = useState<FormPost>({
    title: "",
    image: "",
    description: "",
    friends: [],
    location: "",
    timeframe: "Daily",
    date: "",
    userId: "",
    googleId: "",
    comments: 0,
    likes: 0,
    dislikes: 0,
    userName: "",
  });

  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
      | ChangeEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    setPostForm({ ...postForm, [e.target.name]: e.target.value });
  };

  const updateLoggedInUser = async () => {
    try {
      const collectionRef = collection(db, "users");
      const q = query(collectionRef, where("googleId", "==", user?.uid));
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

  const fileChosen = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files[0]) {
      setImageChosen(e.target.files[0]);
    } else return;
  };

  const getImageURL = async (e) => {
    e.preventDefault();
    if (imageChosen) {
      try {
        const imageRef = ref(storage, `images/${imageChosen.name + v4()}`);
        const imageUrl = await uploadBytes(imageRef, imageChosen);
        const photoUrl = await getDownloadURL(imageRef);
        setPostForm({ ...postForm, image: photoUrl });
        toast.success("Image uploaded! 💫");
        return;
      } catch (err) {
        toast.error("Image could not upload, please try again. ❌");
        console.log(err);
      }
    } else {
      toast.error("No image selected!");
      return;
    }
  };

  const createPost = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (!postForm.title) {
        toast.error("Post needs to have a title");
        return;
      }
      let today: Date | string = new Date();
      today = today.toLocaleDateString();
      const collectionRef = collection(db, "posts");
      await addDoc(collectionRef, {
        ...postForm,
        userId: loggedInUser?.id,
        date: today,
        userName: user?.displayName,
        googleId: user?.uid,
      });
      toast.success("Post successfully been created! ✅");
      console.log(postForm);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user) {
      updateLoggedInUser();
    }
  }, [user]);

  return (
    <div className="p-2 flex flex-col gap-2 max-w-[700px]  mx-auto">
      <ToastContainer limit={1} />

      <h1 className="font-bold text-teal-500 text-2xl">Post</h1>
      <p className="text-sm">
        Create a Highlight for your timeframe, or use an already made Highlight.
        If you would like to use an already made highlight for your timeframe,
        then select below. For example- if a highlight you posted for a weekly
        highlight was the highlight of your month, then reuse that one for the
        monthly!
      </p>
      <form className="shadow-xl rounded-lg flex flex-col gap-2 p-2">
        <h1 className="font-bold text-teal-500 text-xl">Create Highlight</h1>
        <h1 className="font-bold text-teal-500">Title:</h1>
        <input
          onChange={(e) => handleChange(e)}
          className="bg-gray-100 rounded-xl pl-2"
          type="text"
          name="title"
          placeholder="title..."
          value={postForm.title}
        />
        <h1 className="font-bold text-teal-500">Image:</h1>
        <div className="flex justify-between items-center">
          <input type="file" name="image" onChange={(e) => fileChosen(e)} />
          <button
            onClick={getImageURL}
            className="bg-teal-500 py-2 px-4 rounded-xl text-white hover:bg-teal-600"
          >
            Upload
          </button>
        </div>
        <h1 className="font-bold text-teal-500">Description:</h1>
        <textarea
          onChange={(e) => handleChange(e)}
          className="bg-gray-100 rounded-xl pl-2"
          rows={4}
          name="description"
          placeholder="description..."
          value={postForm.description}
        ></textarea>
        <h1 className="font-bold text-teal-500">Tag Friends:</h1>
        {/* !! this one needs to be pushed to the friends thing??? */}
        <input
          onChange={(e) => handleChange(e)}
          className="bg-gray-100 rounded-xl pl-2"
          type="text"
          name="friends"
          placeholder="friends..."
          value={postForm.friends}
        />
        <h1 className="font-bold text-teal-500">Location:</h1>
        {/* !! This could be a search and upload suggestor thing */}
        <input
          onChange={(e) => handleChange(e)}
          className="bg-gray-100 rounded-xl pl-2"
          type="text"
          name="location"
          placeholder="location..."
          value={postForm.location}
        />
        <h1 className="font-bold text-teal-500">Timeframe:</h1>
        <select
          onChange={(e) => handleChange(e)}
          value={postForm.timeframe}
          name="timeframe"
        >
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>

        <button
          onClick={(e) => createPost(e)}
          type="submit"
          className="bg-teal-500 py-2 px-4 rounded-xl text-white hover:bg-teal-600"
        >
          Create Highlight
        </button>
      </form>
      <UsePost />
    </div>
  );
};

export default CreatePostPage;
