import { Link } from 'react-router-dom';
import { Post } from '../../types/Board';
import axios from 'axios';
import { useState, useEffect } from 'react';

const PopularPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      // 전체 카테고리 인기글 출력을 위해 전체 글을 받아오고 클라이언트에서 정렬하는 방식
      
      // const postsResponse = await axios.get(API+'posts'); // 실제 api
      const postsResponse = await axios.get('http://localhost:3300/posts'); // json server

      setPosts(postsResponse.data);
    };

    fetchPosts();
  }, []);

  return (
    <div className="w-52 ml-20">
      <div className="w-52 mt-28 rounded-lg bg-gray-200">
        <div className="p-3 text-lg font-bold border-b border-b-gray-700 ">
          전체 인기글
        </div>
        <div className="divide-y divide-gray-500">
          {posts
            .filter((post) => post.likes >= 5)
            .sort((a, b) => b.likes - a.likes)
            .slice(0, 5)
            .map((post) => (
              <div key={post.id} className="p-3 text-sm">
                <Link to={`/board/post/${post.id}`}>{post.title}</Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default PopularPosts;
