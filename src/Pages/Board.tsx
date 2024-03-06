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
    <div className="w-body m-auto">
      <div className="flex">
        <div className="w-44 mr-20">
          search {/* 검색 구현 */}
          <div className="mt-28">
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
        </div>
        <div className="w-mainContent"> {/* 크기 조정 후 tailwind.config.js에 추가할 것 */}
          <h1 className="text-white text-2xl mt-5 pb-5">
            {selectedSubCategory}
          </h1>
          <div className="pb-3 flex justify-between">
            <div>
              <button className="text-gray-900 border border-gray-100 rounded-full focus:outline-none bg-white hover:bg-gray-100 focus:ring-1 focus:ring-gray-300 font-bold text-sm mr-2 pl-2 pr-2 py-1.5"
                onClick={() => setFilter('전체글')}
              >
                <RiFileList2Line className="inline-block pe-1 pb-1" />
                전체글
              </button>
              <button className="text-white border border-red-700 rounded-full focus:outline-none bg-red-700 hover:bg-red-800 focus:ring-1 focus:ring-red-700 font-bold text-sm mr-2 pl-2 pr-2 py-1.5"
                onClick={() => setFilter('인기글')}
              >
                <HiMiniFire className="inline-block pe-1 pb-1" />
                인기글
              </button>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-gray-900 border border-gray-100 bg-white hover:bg-gray-100 focus:ring-1 focus:outline-none focus:ring-gray-300 font-bold text-sm pl-2 pr-2 py-1.5 rounded-full inline-flex items-center"
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
            <button className="text-gray-900 border border-gray-100 rounded-full focus:outline-none bg-white  hover:bg-gray-100 focus:ring-1 focus:ring-gray-300 font-bold text-sm pl-2 pr-2 py-1.5">
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
                    <Link to={`/board/${post.id}`}>{post.title}</Link> {/* 두 줄 고정으로 할 것 */}
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
