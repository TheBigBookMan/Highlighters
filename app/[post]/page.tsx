import Post from "@/components/post/Post";

const PostPage = ({ searchParams }) => {
  return (
    <div>
      <h1>MPost</h1>
      <Post postId={searchParams.id} />
    </div>
  );
};

export default PostPage;
