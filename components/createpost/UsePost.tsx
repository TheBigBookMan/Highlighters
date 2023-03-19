"use client";
import { useState } from "react";

const UsePost = () => {
  const [selectedPost, setSelectedPost] = useState<string>("Post1");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("Daily");
  const [selectedUploadTimeframe, setSelectedUploadTimeframe] =
    useState<string>("Weekly");

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
          value={selectedPost}
        >
          <option value="post1">Post 1</option>
          <option value="post2">Post 2</option>
          <option value="post3">Post 3</option>
          <option value="post4">Post 4</option>
        </select>
        <h1 className="font-bold text-teal-500">
          Select Timeframe To Upload To:
        </h1>
        <select
          value={selectedUploadTimeframe}
          onChange={(e) => setSelectedUploadTimeframe(e.target.value)}
          className="w-full"
        >
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>
        <button className="bg-teal-500 py-2 px-4 rounded-xl text-white hover:bg-teal-600">
          Select
        </button>
      </form>
    </div>
  );
};

export default UsePost;
