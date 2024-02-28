import { Link } from "react-router-dom";
import { PostListProps } from "../../types/Board";

const MainContent = ({ posts }: PostListProps) => {
  return (
    <div className="w-1/2">
      {posts.map((post) => (
        <div key={post.id} className="border border-gray-300 rounded p-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="text-lg font-bold">
              <Link to={`/board/${post.category}/${post.id}`}>{post.title}</Link>
            </div>
            <div className="text-sm text-gray-500">
              <span>작성자: {post.user_id}</span>
              <span>작성일: {post.created_at}</span>
            </div>
          </div>
          <div className="mt-4">
            <Link to={`/post/${post.id}`}>{post.content}</Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainContent;
