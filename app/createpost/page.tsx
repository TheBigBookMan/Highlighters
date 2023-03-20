"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import UsePost from "@/components/createpost/UsePost";
import "react-toastify/dist/ReactToastify.css";
import { db, storage } from "@/utils/firebase";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

const CreatePostPage = () => {
  const [imageChosen, setImageChosen] = useState<ImageFile | null>(null);
  const [postForm, setPostForm] = useState<Post>({
    title: "",
    image: "",
    description: "",
    friends: [],
    location: "",
    timeframe: "",
    date: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    e.preventDefault();
    setPostForm({ ...postForm, [e.target.name]: e.target.value });
  };

  const fileChosen = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files[0]) {
      setImageChosen(e.target.files[0]);
    } else return;
  };

  // ? I think the iamge upload will save the pic as a url in the bucket and then use that url as the string for the image object

  const createPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(postForm);
    //? check if image was uploaded, if not then leave empty

    if (imageChosen) {
      try {
        const imageRef = ref(storage, `images/${imageChosen.name + v4()}`);
        const imageUrl = await uploadBytes(imageRef, imageChosen);
        // const bucketURL =
        //   (await imageUrl.ref?.location.bucket) + imageUrl.ref?.location.path;
        // console.log(bucketURL);

        const photoUrl = await getDownloadURL(imageRef);
        console.log(photoUrl);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="p-2 flex flex-col gap-2 max-w-[700px]  mx-auto">
      <h1 className="font-bold text-teal-500 text-2xl">Post</h1>
      <p className="text-sm">
        Create a Highlight for your timeframe, or use an already made Highlight.
        If you would like to use an already made highlight for your timeframe,
        then select below. For example- if a highlight you posted for a weekly
        highlight was the highlight of your month, then reuse that one for the
        monthly!
      </p>
      <form
        onSubmit={(e) => createPost(e)}
        className="shadow-xl rounded-lg flex flex-col gap-2 p-2"
      >
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
        <input type="file" name="image" onChange={(e) => fileChosen(e)} />
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
