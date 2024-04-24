import { useEffect, useState } from 'react';
import { Link, useSearchParams } from "react-router-dom";
import PostList from '../components/Board/PostList';
import BoardCategory from '../components/Board/BoardCategory';
import FilterButtons from '../components/Board/FilterButtons';
import PopularPosts from '../components/Board/PopularPosts';
import Pagination from '../components/Board/Pagination';
import { apiWithoutAuth } from '../components/common/axios';
import { RiFileList2Line } from "react-icons/ri";
import { FaSearch } from 'react-icons/fa';
import { API } from '../config';
import { Post, PostCategory, SelectedCategory } from '../types/Board';
import { Category } from '../types/Category';

function Board() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>({ name: "전체 게시글", id: null }); // 선택된 세부 카테고리
  const [title, setTitle] = useState<string>(); // 게시글 상단 문자열

  const [posts, setPosts] = useState<Post[] | null>(null);
  const [sort, setSort] = useState("최신순"); // 정렬 방식
  const [searchWord, setSearchWord] = useState(""); // 검색어

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const LIKES_NUMBER = 5; // 인기글 조건: 좋아요 수 LIKES_NUMBER 이상인 글들이 인기글
  const POSTS_PER_PAGE = 10; // 한 페이지에 보여줄 게시글 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPosts, setTotalPosts] = useState(0); // 게시판에 표시되어야 할 전체 게시글 수

  // 카테고리 가져오기  
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await apiWithoutAuth.get(API + 'categories');      
      // posts만 뽑기
      const posts = response.data.filter((data: Category) => data.division === 'posts');

      // 각 post에 속하는 subPosts를 찾아서 연결
      const postsWithSubPosts = posts.map((post: Category) => {
        const subPosts = response.data.filter((data: Category) => Number(data.parent_id) === post.id);
        return { ...post, subPosts };
      });
      setCategories(postsWithSubPosts);
    };

    fetchCategories();
  }, []);

  // 게시글 가져오기
  // 카테고리, 검색어, 정렬 기준, 페이지네이션을 포함한 게시글 데이터를 가져오는 함수
  const fetchPosts = async ({ categoryId, searchTerm, sortBy, page }) => {
    // 백엔드 API 호출 
    // 예: `fetch('/api/posts?category=${categoryId}&search=${searchTerm}&sort=${sortBy}&page=${page}')`
    // 임시로 전체 글 호출
    const response = await apiWithoutAuth.get(API + 'posts');
    
    return response.data;
  };

  // // 카테고리 기준 게시글 데이터 가져오기
  // const fetchPostsByCategory = async (category_id: number) => {
  //   const response = await apiWithoutAuth.get(`${API}posts/category/${category_id}`);
  //   return response.data;
  // }

  // 카테고리를 선택하면 이동
  const selectCategoryAndNavigate = (id: number) => {
    console.log(id);
    console.log(categories);
    
    const category = categories.find((category) => category.subPosts.find(category => category.id === id));
    console.log(category);

    if (category) {
      setSelectedCategory({ name: category.name, id: category.id });
      setSearchParams({ ...Object.fromEntries(searchParams), category: id.toString() });
    }
  };

  // URL의 쿼리 스트링이 변경될 때마다 쿼리 스트링에 따라 글 가져오기 - 카테고리, 검색어, 정렬기준, 페이지네이션
  useEffect(() => {
    const categoryId = searchParams.get('category');
    const searchTerm = searchParams.get('search');
    const sortBy = searchParams.get('sort');
    const page = searchParams.get('page');

    // 카테고리 ID를 사용해 카테고리 이름 찾고 게시판 상단 문자열 변경
    const category = categories.find(c => c.id === Number(categoryId));
    if (category) {
      setTitle(category.name);
    }

    // 게시글 데이터 가져오기
    fetchPosts({ categoryId, searchTerm, sortBy, page }).then(data => setPosts(data));
  }, [searchParams, categories]);

  // // 글 페이지 설정
  // useEffect(() => {
  //   const page = searchParams.get("page");
  //   setCurrentPage(page ? parseInt(page) : 1);
  // }, [searchParams]);

  // // 카테고리 선택 핸들러
  // const handleCategoryChange = (event) => {
  //   const newCategory = event.target.value;
  //   setSearchParams({ ...Object.fromEntries(searchParams), category: newCategory });
  // };

  // 검색어 입력 핸들러
  const handleSearchChange = () => {
    setSearchParams({ ...Object.fromEntries(searchParams), search: searchWord });
  };

  // 탭 선택 핸들러
  const handleTabChange = (tab:string) => {
    setSearchParams({ ...Object.fromEntries(searchParams), tab: tab });
  }

  // 정렬 옵션 선택 핸들러
  const handleSortChange = (option:string) => {
    setSearchParams({ ...Object.fromEntries(searchParams), sort: option });
  };

  // 페이지네이션
  function paginate(pageNumber: number): void {
    setSearchParams({ ...Object.fromEntries(searchParams), page: pageNumber.toString() });
  }

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
            onClick={handleSearchChange}
            className="ml-3 text-gray-900 border border-gray-300 rounded-full leading-tight focus:outline-none bg-white hover:bg-gray-100 focus:ring-1 focus:ring-gray-300 font-semibold text-sm px-4 py-2"
          >
            검색
          </button>
        </div>
        <BoardCategory categories={categories} selectedCategory={selectedCategory} onSelectCategory={selectCategoryAndNavigate} />
      </div>
      <div className="laptop:w-[47.6875rem] w-mainContent">
        <h1 className="text-white text-2xl mt-5 pb-5">
          {title}
        </h1>
        <div className="flex justify-between">
          <div>
            <FilterButtons
              handleTabChange={handleTabChange}
              sort={sort}
              setSort={setSort}
              dropdownOpen={dropdownOpen}
              setDropdownOpen={setDropdownOpen}
            />
          </div>
          <Link to={`/board/write`}>
            <button className="text-gray-900 border border-gray-100 focus:outline-none bg-white  hover:bg-gray-100 focus:ring-1 focus:ring-gray-300 font-semibold text-sm pl-2 pr-2 py-1.5">
              <RiFileList2Line className="inline-block pe-1 pb-1" />
              글쓰기
            </button>
          </Link>
        </div>
        {/* <PostList posts={posts} /> */}
        <Pagination
          totalPosts={totalPosts}
          postsPerPage={POSTS_PER_PAGE}
          currentPage={currentPage}
          paginate={paginate}
        />
      </div>
      {/* <PopularPosts /> */}
    </div>
  )
}

export default Board;
