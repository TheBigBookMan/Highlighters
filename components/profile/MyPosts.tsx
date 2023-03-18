const hardcode = ["Daily", "Weekly", "Monthly", "Yearly"];

const MyPosts = () => {
  return (
    <div className="shadow-xl rounded-lg h-full w-full p-4 flex">
      <h1 className="font-bold text-2xl text-teal-500">My Posts</h1>
      <ul className="flex gap-2"></ul>
    </div>
  );
};

export default MyPosts;
