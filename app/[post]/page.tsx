import Post from "@/components/post/Post";
import Comments from "@/components/post/Comments";

const PostPage = ({ params }: Params) => {
  return (
    <div className="p-4">
      <h1 className="font-bold text-2xl text-teal-500">Highlight</h1>
      <Post params={params} />
      <Comments params={params} />
    </div>
  );
};

export default PostPage;
