import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link , useNavigate, useSearchParams } from "react-router-dom";
import { RiFileList2Line } from "react-icons/ri";
import PostList from '../components/Board/PostList';
import { Post } from '../types/Board';
import BoardCategory from '../components/Board/BoardCategory';
import FilterButtons from '../components/Board/FilterButtons';
import PopularPosts from '../components/Board/PopularPosts';
import { API } from '../config';

function Board() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState<string>();
  
  const [title, setTitle] = useState<string>();

  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState("전체글"); // 전체글, 인기글 필터
  const [sort, setSort] = useState("등록순"); // 정렬 방식
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const LIKES_NUMBER = 5; // 인기글 조건: 좋아요 수 LIKES_NUMBER 이상인 글들이 인기글

  // 링크 설정
  useEffect(() => {
    const category = searchParams.get("category")
    if (category === null) {
      setCategory("all");
      return;
    }
    setCategory(category)
  }, [searchParams])

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
      } catch(err) {
        // 잘못된 경로일 시 (예: /board/category/dsaf) 게시판 메인 페이지로 이동
        navigate("/board");
      }
    }
    categoryToTitle();
  }, [category,navigate]);

  // 쿼리스트링의 카테고리에 맞는 게시글만 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      // 게시글 가져올 때 link에 맞는 게시글만 가져오도록 수정
      // 카테고리가 전체일 경우 전체 글 가져오기
      if (category === "all") {
        const postsResponse = await axios.get(API+'posts'); // API
        console.log(postsResponse);
        
        setPosts(postsResponse.data);
        return;
      }

      // 카테고리가 전체가 아닐 경우: 지정되어 있을 경우
      // 카테고리 아이디 검색
      const categoryData = await axios.get(`${API}categories?link=${category}`);
      console.log(categoryData.data[0].id);
      const category_id = categoryData.data[0].id;
      
      // 검색한 카테고리 아이디를 이용하여 글 목록에서 해당 카테고리 글만 인출
      const postsResponse = await axios.get(`${API}posts?category_id=${category_id}`);

      setPosts(postsResponse.data);
    };

    fetchPosts();
  }, [category]);

  let filteredPosts = posts;

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
    <div className="laptop:w-[75rem] w-body m-auto flex">
      <BoardCategory />
      <div className="laptop:w-[47.6875rem] w-mainContent">
        <h1 className="text-white text-2xl mt-5 pb-5">
          {title}
        </h1>
        <div className="pb-3 flex justify-between">
          <FilterButtons
            setFilter={setFilter}
            sort={sort}
            setSort={setSort}
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
          >
          </FilterButtons>
          <Link to={`/board/write`}>
            <button className="text-gray-900 border border-gray-100 rounded-full focus:outline-none bg-white  hover:bg-gray-100 focus:ring-1 focus:ring-gray-300 font-semibold text-sm pl-2 pr-2 py-1.5">
              <RiFileList2Line className="inline-block pe-1 pb-1" />
              글쓰기
            </button>
          </Link>
        </div>
        <PostList posts={filteredPosts} />
      </div>
      <PopularPosts />
    </div>
  )
}

export default Board;
