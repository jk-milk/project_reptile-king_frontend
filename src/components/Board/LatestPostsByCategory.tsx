

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiWithoutAuth } from '../common/axios';
import { API } from '../../config';
import { Post } from '../../types/Board';
import { MdFiberNew } from 'react-icons/md';

// 카테고리별 최신 게시글 섹션 컴포넌트
const LatestPostsByCategory = ({ categoryId }: { categoryId: number }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  // 해당 카테고리의 글 가져오기
  useEffect(() => {
    const fetchPostsByCategory = async () => {
      const response = await apiWithoutAuth.get(`${API}posts/category/${categoryId}`);
      setPosts(response.data.data);
    };

    fetchPostsByCategory();
  }, [categoryId]);

  return (
    <div className="bg-white px-4 rounded-lg">
      <div className="flex justify-between items-center mb-1">
        <Link to={`/board/lists?category=${categoryId}`} className="font-semibold text-lg text-green-600">
          {posts[0]?.category_name}
        </Link>
        <Link to={`/board/lists?category=${categoryId}`} className="flex items-center text-sm text-gray-500">
          もっと見る {">"}
        </Link>
      </div>
      <hr />
      {posts.map((post) => (
        <ul key={post.id} className="border-b p-1">
        <li className="flex items-center">
          {/* <span>{post.title.substring(0, 20)}...</span> */} 
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

export default LatestPostsByCategory;
