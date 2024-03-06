import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RiFileList2Line } from "react-icons/ri";
import { HiMiniFire } from "react-icons/hi2";
import PostList from '../components/Board/PostList';
import { Post, PostCategory } from '../types/Board';

function Board() {

  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("전체 게시글"); // 선택된 세부 카테고리
  const [filter, setFilter] = useState('전체글'); // 전체글, 인기글 필터
  const [sort, setSort] = useState('등록순'); // 정렬 방식
  
  const LIKES_NUMBER = 5; // 인기글 조건 좋아요 수

  useEffect(() => {
    const fetchPosts = async () => {
      // const categoriesResponse = await axios.get('http://localhost:8080/categories'); // 실제 api
      // const postsResponse = await axios.get('http://localhost:8080/api/posts');
      const categoriesResponse = await axios.get('http://localhost:3300/categories'); // json server
      const postsResponse = await axios.get('http://localhost:3300/posts');

      setCategories(categoriesResponse.data);
      setPosts(postsResponse.data);
    };

    fetchPosts();
  }, []);

  // 선택된 세부 카테고리에 따라 게시물 필터링
  let filteredPosts = selectedSubCategory
    ? (selectedSubCategory === "전체 게시글" // 전체 게시글 카테고리일 경우 전체 출력
      ? posts
      : posts.filter(post => post.category === selectedSubCategory))
    : posts; // 아무것도 선택되지 않았을 경우

  // 전체글, 인기글 필터링
  if (filter === '인기글') {
    filteredPosts = filteredPosts.filter(post => post.likes >= LIKES_NUMBER);
  }

  switch (sort) {
    case '등록순':
      filteredPosts.sort((a, b) => b.id - a.id); // id 기준 내림차순 정렬
      break;
    case '최신순':
      filteredPosts.sort((a, b) => a.id - b.id); // id 기준 올림차순 정렬
      break;
    // case '댓글순': 차후 구현
    default:
      break;
  }

  return (
    <div className="w-body m-auto">
      <div className="flex">
        <div className="w-44 mr-20">
          Search
          {categories.map((category) => (
            <div key={category.id} className="w-full p-2">
              <div className="border-b-2 pb-2">
                <p className="text-lg text-white ps-2">
                  {category.category}
                </p>
              </div>
              <ul className="w-full">
                {category.subCategories.map((subCategory) => (
                  <li key={subCategory.title}>
                    <button
                      className={
                        selectedSubCategory === subCategory.title
                          ? "ps-2 py-0.5 text-white font-bold hover:underline"
                          : "ps-2 py-0.5 text-white hover:font-bold hover:underline"
                      }
                      onClick={() => setSelectedSubCategory(subCategory.title)}
                    >
                      {subCategory.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="w-[59.75rem]"> {/* 크기 조정 후 tailwind.config.js에 추가할 것 */}
          <h1 className="text-white text-2xl mt-5 pb-5">
            {selectedSubCategory}
          </h1>
          <div className="pb-3 flex justify-between">
            <div>
              <button className="text-gray-900 bg-white border border-gray-800 hover:bg-gray-100 focus:ring-1 focus:ring-gray-800 font-bold text-sm pl-1.5 pr-2 py-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                onClick={() => setFilter('전체글')}
              >
                <RiFileList2Line className="inline-block pe-1 pb-1" />
                전체글
              </button>
              <button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 border border-red-700 focus:ring-1 focus:ring-red-300 font-bold text-sm pl-1.5 pr-2 py-1 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                onClick={() => setFilter('인기글')}
              >
                <HiMiniFire className="inline-block pe-1 pb-1" />
                인기글
              </button>
              <select
                className="border border-gray-800 font-bold text-sm pl-1.5 pr-2 py-1"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="등록순">등록순</option>
                <option value="최신순">최신순</option>
                {/* <option value="댓글순">댓글순</option> */}
              </select>
            </div>
            <button className="text-gray-900 bg-white border border-gray-800 hover:bg-gray-100 focus:ring-1 focus:ring-gray-800 font-bold text-sm pl-1.5 pr-2 py-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
              <RiFileList2Line className="inline-block pe-1 pb-1" />
              글쓰기
            </button>
          </div>
          <PostList posts={filteredPosts} />
        </div>
        <div className="w-52 ml-20">
          <div className="w-52 mt-28 rounded-lg bg-gray-200">
            <div className="p-3 text-lg font-bold border-b border-b-gray-700 ">
              이 카테고리 인기글
            </div>
            <div className="divide-y divide-gray-500"> {/* 하위 요소들 사이 테두리 */}
              {posts
                .filter((post) => post.likes >= LIKES_NUMBER)
                .sort((a, b) => b.likes - a.likes)
                .slice(0, 5)
                .map((post) => (
                  <div
                    key={post.id}
                    className="p-3 text-sm"
                  >
                    <Link to={`/board/${post.id}`}>{post.title}</Link>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Board
