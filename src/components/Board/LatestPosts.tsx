import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiWithoutAuth } from '../common/axios';
import { API } from '../../config';
import { Post } from '../../types/Board';
import { MdFiberNew } from 'react-icons/md';

// 전체글보기 컴포넌트
const LatestPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  // 전체게시글 가져오기
  const fetchPosts = async () => {
    const response = await apiWithoutAuth.get(`${API}posts`);
    console.log(response.data);
    setPosts(response.data.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="bg-white px-4 rounded-lg">
      {/* <div className="bg-white rounded-lg shadow-lg p-5 max-w-md mx-auto"> */}

      <div className="flex justify-between items-center mb-1">
        <Link to={`/board/lists`} className="font-semibold text-lg text-green-600">
          전체글보기
        </Link>
        <Link to={`/board/lists`} className="flex items-center text-sm text-gray-500">
          더보기 {">"}
        </Link>
      </div>
      <hr />
      {posts.map((post) => (
        <ul key={post.id} className="border-b p-1">
          <li className="flex items-center">
            <Link to={`/board/view/${post.id}`}>{post.title.substring(0, 20)}...</Link>
            {/* <span className="flex items-center ml-4 text-gray-500 text-sm"><FaRegComment /> {post.comments?.length || 0}</span> */}
            {/* {post.isNew && <FaRegStar className="ml-2 text-yellow-500" />} */}
            {/* 글 등록일로부터 1일이 지나지 않았으면 표시 */}
            <MdFiberNew className="ml-2 text-orange-400" />
          </li>
        </ul>
      ))}
    </div>
  );
};

export default LatestPosts;
