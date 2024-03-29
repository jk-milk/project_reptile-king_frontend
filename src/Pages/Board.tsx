import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { RiFileList2Line } from "react-icons/ri";
import PostList from '../components/Board/PostList';
import { Post } from '../types/Board';
import BoardCategory from '../components/Board/BoardCategory';
import FilterButtons from '../components/Board/FilterButtons';
import PopularPosts from '../components/Board/PopularPosts';

function Board() {

  const { link } = useParams();
  console.log(link);
  const [title, setTitle] = useState(link? link : "전체 게시글");

  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState("전체글"); // 전체글, 인기글 필터
  const [sort, setSort] = useState("등록순"); // 정렬 방식
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const LIKES_NUMBER = 5; // 인기글 조건: 좋아요 수 LIKES_NUMBER 이상인 글들이 인기글

  useEffect(()=>{
    // link에 맞춰서 title 변경하도록 서버와 연결
    setTitle(link? link : "전체 게시글"); // 임시로 타이틀은 link로 설정
  }, [link])

  useEffect(() => {
    const fetchPosts = async () => {
      // 게시글 가져올 때 link에 맞는 게시글만 가져오도록 수정
      
      // const postsResponse = await axios.get(API+'posts'); // 실제 api
      const postsResponse = await axios.get('http://localhost:3300/posts'); // json server

      setPosts(postsResponse.data);
    };

    fetchPosts();
  }, []);

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
          <Link to={`write`}>
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
