import Newsfeed from "@/components/newsfeed/Newsfeed";

//TODO
//TODO actually make this the layout and then the smaller components get added

const NewsfeedPage = () => {
  //?? This is the line for the data load if it doesnt load throw the error to the error component
  // throw Error("Newsfeed not load");
  return (
    <div className="p-2">
      <h1 className="font-bold text-2xl text-teal-500">Newsfeed</h1>
      <Newsfeed />
    </div>
  );
};

export default NewsfeedPage;
