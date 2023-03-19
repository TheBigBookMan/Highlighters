"use client";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreatePostPage = () => {
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
    console.log(e.target.files);
    // TODO this will need to go to s3 bucket or maybe the firebase as image bucket
  };

  return (
    <div className="p-2  max-w-[500px]  mx-auto">
      <h1 className="font-bold text-teal-500 text-2xl">Create Post</h1>

      <form className="shadow-xl rounded-lg flex flex-col gap-2 p-2">
        <h1 className="font-bold text-teal-500">Post Title:</h1>
        <input
          onChange={(e) => handleChange(e)}
          className="bg-gray-100 rounded-xl pl-2"
          type="text"
          name="title"
          placeholder="title..."
          value={postForm.title}
        />
        <h1 className="font-bold text-teal-500">Post Image:</h1>
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

        <button className="bg-teal-500 py-2 px-4 rounded-xl text-white hover:bg-teal-600">
          Create Highlight
        </button>
      </form>
    </div>
  );
};

export default CreatePostPage;
