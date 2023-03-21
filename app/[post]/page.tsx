import Post from "@/components/post/Post";

const PostPage = ({ params }: Params) => {
  return (
    <div>
      <h1>MPost</h1>
      <Post params={params} />
    </div>
  );
};

export default PostPage;
