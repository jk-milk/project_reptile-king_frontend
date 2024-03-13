import axios from 'axios';
import { useEffect, useState } from 'react';
import { RiFileList2Line } from "react-icons/ri";
import { HiMiniFire } from "react-icons/hi2";
import PostList from '../components/Board/PostList';
import { Post, PostCategory } from '../types/Board';
import BoardCategory from '../components/Board/BoardCategory';
import PopularPosts from '../components/Board/PopularPosts';

function Board() {

  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("전체 게시글"); // 선택된 세부 카테고리
  const [filter, setFilter] = useState('전체글'); // 전체글, 인기글 필터
  const [sort, setSort] = useState('등록순'); // 정렬 방식
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
    <div className="w-body m-auto flex">
      <BoardCategory categories={categories} selectedSubCategory={selectedSubCategory} setSelectedSubCategory={setSelectedSubCategory} />
      <div className="w-mainContent">
        <h1 className="text-white text-2xl mt-5 pb-5">
          {selectedSubCategory}
        </h1>
        <div className="pb-3 flex justify-between">
          <div>
            <button className="text-gray-900 border border-gray-100 rounded-full focus:outline-none bg-white hover:bg-gray-100 focus:ring-1 focus:ring-gray-300 font-semibold text-sm mr-2 pl-2 pr-2 py-1.5"
              onClick={() => setFilter('전체글')}
            >
              <RiFileList2Line className="inline-block pe-1 pb-1" />
              전체글
            </button>
            <button className="text-white border border-red-700 rounded-full focus:outline-none bg-red-700 hover:bg-red-800 focus:ring-1 focus:ring-red-700 font-semibold text-sm mr-2 pl-2 pr-2 py-1.5"
              onClick={() => setFilter('인기글')}
            >
              <HiMiniFire className="inline-block pe-1 pb-1" />
              인기글
            </button>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-gray-900 border border-gray-100 bg-white hover:bg-gray-100 focus:ring-1 focus:outline-none focus:ring-gray-300 font-semibold text-sm pl-2 pr-2 py-1.5 rounded-full inline-flex items-center"
            >
              {sort}
              <svg className="w-2.5 h-2.5 ms-1 mt-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
              </svg>
            </button>
            {dropdownOpen &&
              <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow mt-1 ml-40 w-44">
                <ul className="py-2 text-sm text-gray-700">
                  <li>
                    <button onClick={() => { setSort('등록순'); setDropdownOpen(false); }} className="block px-4 py-2 w-full text-left hover:bg-gray-100">등록순</button>
                  </li>
                  <li>
                    <button onClick={() => { setSort('최신순'); setDropdownOpen(false); }} className="block px-4 py-2 w-full text-left hover:bg-gray-100">최신순</button>
                  </li>
                  {/* <li>
                      <button onClick={() => { setSort('댓글순'); setDropdownOpen(false); }} className="block px-4 py-2 hover:bg-gray-100">댓글순</button>
                    </li> */}
                </ul>
              </div>
            }
          </div>
          <button className="text-gray-900 border border-gray-100 rounded-full focus:outline-none bg-white  hover:bg-gray-100 focus:ring-1 focus:ring-gray-300 font-semibold text-sm pl-2 pr-2 py-1.5">
            <RiFileList2Line className="inline-block pe-1 pb-1" />
            글쓰기
          </button>
        </div>
        <PostList posts={filteredPosts} />
      </div>
      <PopularPosts posts={posts} />
    </div>
  )
}

export default Board
