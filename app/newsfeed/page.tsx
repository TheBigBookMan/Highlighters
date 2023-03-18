import Newsfeed from "@/components/newsfeed/Newsfeed";

const NewsfeedPage = () => {
  //?? This is the line for the data load if it doesnt load throw the error to the error component
  // throw Error("Newsfeed not load");
  return (
    <div>
      <h1 className="">heree</h1>
      <Newsfeed />
    </div>
  );
};

export default NewsfeedPage;
