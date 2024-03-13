import { Link } from 'react-router-dom';
import { Post } from '../../types/Board';

const PopularPosts = ({ posts }: { posts: Post[] }) => {
  return (
    <div className="w-52 ml-20">
      <div className="w-52 mt-28 rounded-lg bg-gray-200">
        <div className="p-3 text-lg font-bold border-b border-b-gray-700 ">
          이 카테고리 인기글
        </div>
        <div className="divide-y divide-gray-500">
          {posts
            .filter((post) => post.likes >= 5)
            .sort((a, b) => b.likes - a.likes)
            .slice(0, 5)
            .map((post) => (
              <div key={post.id} className="p-3 text-sm">
                <Link to={`/board/${post.id}`}>{post.title}</Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default PopularPosts;
