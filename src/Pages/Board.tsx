import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { RiFileList2Line } from "react-icons/ri";
import PostList from '../components/Board/PostList';
import { Post } from '../types/Board';
import BoardCategory from '../components/Board/BoardCategory';
import FilterButtons from '../components/Board/FilterButtons';
import PopularPosts from '../components/Board/PopularPosts';
import { API } from '../config';
import { FaSearch } from 'react-icons/fa';
import Pagination from '../components/Board/Pagination';

function Board() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState<string>();
  const [title, setTitle] = useState<string>(); // 게시글 상단 문자열

  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState("전체글"); // 전체글, 인기글 필터
  const [sort, setSort] = useState("등록순"); // 정렬 방식
  const [searchWord, setSearchWord] = useState(""); // 검색어
  let filteredPosts = posts;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const LIKES_NUMBER = 5; // 인기글 조건: 좋아요 수 LIKES_NUMBER 이상인 글들이 인기글
  const POSTS_PER_PAGE = 3; // 한 페이지에 보여줄 게시글 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPosts, setTotalPosts] = useState(0); // 게시판에 표시되어야 할 전체 게시글 수

  // 링크 설정
  useEffect(() => {
    const category = searchParams.get("category")
    if (category === null) {
      setCategory("all");
      return;
    }
    setCategory(category)
  }, [searchParams])

  // 글 페이지 설정
  useEffect(() => {
    const page = searchParams.get("page");
    setCurrentPage(page ? parseInt(page) : 1);
  }, [searchParams]);

  // 카테고리에 맞춰서 게시판 상단 문자열 변경
  useEffect(() => {
    if (category === "all") {
      setTitle("전체 게시글");
      return;
    }
    const categoryToTitle = async () => {
      try {
        const categoryData = await axios.get(`${API}categories?link=${category}`);
        setTitle(categoryData.data[0].title);
      } catch (err) {
        // 잘못된 경로일 시 게시판 메인 페이지로 이동
        navigate("/board");
      }
    }
    categoryToTitle();
  }, [category, navigate]);

  // 쿼리스트링의 카테고리에 맞는 게시글만 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      const searchWordFromURL = searchParams.get("searchWord"); // URL에서 직접 검색어 가져오기
      let searchWordDecoded = '';
      if (searchWordFromURL) {
        searchWordDecoded = decodeURIComponent(searchWordFromURL);
      }
      let url = `${API}posts?`;

      // 카테고리 필터링
      // 카테고리가 전체일 경우 url에 아무것도 추가하지 않으므로 전체 글 가져오기
      // 카테고리가 undefined가 아니고 전체가 아닐 경우: 지정되어 있을 경우
      if (category && category !== "all") {
        // 카테고리 아이디 검색
        const categoryData = await axios.get(`${API}categories?link=${category}`);
        const category_id = categoryData.data[0].id;
        // 검색한 카테고리 아이디를 이용하여 글 목록에서 해당 카테고리 글만 인출
        url += `category_id=${category_id}&`;
      }

      // 검색어가 있을 경우, 검색어로 필터링
      if (searchWordDecoded) {
        url += `title_like=${searchWordDecoded}&`;
      }

      // 출력해야 할 전체 게시물 수 저장
      try {
        const postsResponse = await axios.get(url);
        setTotalPosts(postsResponse.data.length);
      } catch (err) {
        console.error(err);
      }

      // 페이지네이션 적용
      url += `_page=${currentPage}&_limit=${POSTS_PER_PAGE}`;

      try {
        const postsResponse = await axios.get(url);
        setPosts(postsResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPosts();
  }, [category, currentPage, searchParams]);

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

  // 검색을 위해 쿼리스트링을 사용하여 이동시키는 함수
  const searchForNavigate = () => {
    navigate(`/board?searchWord=${encodeURIComponent(searchWord)}`);
  };

  // 페이지네이션 클릭했을 때 페이지 이동 함수
  const paginate = (pageNumber:number) => {
    setCurrentPage(pageNumber);
    navigate(`?page=${pageNumber}`);
};  

  return (
    <div className="laptop:w-[75rem] w-body m-auto flex">
      <div>
        <div className="mt-28">
          <FaSearch className="inline-block text-white ml-2" />
          <input
            type="text"
            placeholder="Search"
            className="max-w-40 border border-gray-300 rounded-full text-sm ml-2 px-4 py-2 leading-tight focus:outline-none focus:border-blue-500"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
          />
          <button
            onClick={searchForNavigate}
            className="ml-3 text-gray-900 border border-gray-300 rounded-full leading-tight focus:outline-none bg-white hover:bg-gray-100 focus:ring-1 focus:ring-gray-300 font-semibold text-sm px-4 py-2"
          >
            검색
          </button>
        </div>
        <BoardCategory />
      </div>
      <div className="laptop:w-[47.6875rem] w-mainContent">
        <h1 className="text-white text-2xl mt-5 pb-5">
          {title}
        </h1>
        <div className="pb-3 flex justify-between">
          <div>
            <FilterButtons
              setFilter={setFilter}
              sort={sort}
              setSort={setSort}
              dropdownOpen={dropdownOpen}
              setDropdownOpen={setDropdownOpen}
            />
          </div>
          <Link to={`/board/write`}>
            <button className="text-gray-900 border border-gray-100 rounded-full focus:outline-none bg-white  hover:bg-gray-100 focus:ring-1 focus:ring-gray-300 font-semibold text-sm pl-2 pr-2 py-1.5">
              <RiFileList2Line className="inline-block pe-1 pb-1" />
              글쓰기
            </button>
          </Link>
        </div>
        <PostList posts={filteredPosts} />
        <Pagination
          totalPosts={totalPosts}
          postsPerPage={POSTS_PER_PAGE}
          currentPage={currentPage}
          paginate={paginate}
        />
      </div>
      <PopularPosts />
    </div>
  )
}

export default Board;
