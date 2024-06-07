import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import SearchBar from '../components/Board/SearchBar';
import BoardCategory from '../components/Board/BoardCategory';
import { apiWithoutAuth } from '../components/common/axios';
import { RiFileList2Line } from "react-icons/ri";
import { API } from '../config';
import { Post, PostCategory, SelectedCategory } from '../types/Board';
import { Category } from '../types/Category';
import LatestPostsByCategory from '../components/Board/LatestPostsByCategory';
import LatestPosts from '../components/Board/LatestPosts';
import PopularPosts from '../components/Board/PopularPosts';

function Board() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>({ name: "전체 게시글", id: null }); // 선택된 세부 카테고리

  const [posts, setPosts] = useState<Post[] | null>(null);
  console.log(posts);

  const [sort, setSort] = useState("최신순"); // 정렬 방식
  const [searchWord, setSearchWord] = useState(""); // 검색어
  console.log(searchWord);


  const [dropdownOpen, setDropdownOpen] = useState(false);

  const LIKES_NUMBER = 5; // 인기글 조건: 좋아요 수 LIKES_NUMBER 이상인 글들이 인기글
  const POSTS_PER_PAGE = 10; // 한 페이지에 보여줄 게시글 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [totalPosts, setTotalPosts] = useState(0); // 게시판에 표시되어야 할 전체 게시글 수

  // 카테고리 가져오기  
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await apiWithoutAuth.get(API + 'categories');
      // console.log(response, "fetchCategories");

      // posts만 뽑기
      const posts = response.data.filter((data: Category) => data.division === 'posts');

      // 각 post에 속하는 subPosts를 찾아서 연결
      const postsWithSubPosts = posts.map((post: Category) => {
        const subPosts = response.data.filter((data: Category) => Number(data.parent_id) === post.id);
        return { ...post, subPosts };
      });
      console.log(postsWithSubPosts, "postsWithSubPosts");

      setCategories(postsWithSubPosts);
    };

    fetchCategories();
  }, []);

  // 게시글 가져오기
  // 카테고리, 검색어, 정렬 기준, 페이지네이션을 포함한 게시글 데이터를 가져오는 함수
  // const fetchPosts = async ({ categoryId, searchTerm, sortBy, page }) => {
  const fetchPosts = async () => {
    // 백엔드 API 호출 
    // 예: `fetch('/api/posts?category=${categoryId}&search=${searchTerm}&sort=${sortBy}&page=${page}')`
    // 임시로 전체 글 호출
    const response = await apiWithoutAuth.get(`${API}posts`);
    console.log(response.data);
    setPosts(response.data.data);
    setTotalPages(response.data.last_page);
  };

  useEffect(() => {
    fetchPosts();
  }, [])

  // 카테고리 기준 게시글 데이터 가져오기
  const fetchPostsByCategory = async (category_id: number) => {
    const response = await apiWithoutAuth.get(`${API}posts/category/${category_id}`);
    setPosts(response.data.data);
    setTotalPages(response.data.last_page);
  }

  useEffect(() => {
    const categoryId = searchParams.get('category');
    if (categoryId !== null)
      fetchPostsByCategory(Number(categoryId));
  }, [searchParams])

  // 카테고리를 선택하면 이동
  const navigateCategory = (id: number) => {
    console.log(id);
    console.log(categories);

    const category = categories.find((category) => category.subPosts.find(category => category.id === id));
    console.log(category);

    if (category) {
      setSelectedCategory({ name: category.name, id: category.id });
      navigate(`/board/lists?category=${id}`); // 다른 쿼리스트링을 모두 삭제하고 category만 추가
    }
  };

  // 탭 선택 핸들러
  const handleTabChange = (tab: string) => {
    setSearchParams({ ...Object.fromEntries(searchParams), tab: tab });
  }

  // 정렬 옵션 선택 핸들러
  const handleSortChange = (option: string) => {
    setSearchParams({ ...Object.fromEntries(searchParams), sort: option });
  };

  // 페이지네이션
  function paginate(pageNumber: number): void {
    setSearchParams({ ...Object.fromEntries(searchParams), page: pageNumber.toString() });
  }

  return (
    <div className="pt-10 pb-10 laptop:w-[67.5rem] w-body m-auto">
      <div className="bg-white rounded px-5 py-4 flex">
        <div className="flex flex-col space-y-4">
          <SearchBar />
          <Link to={`/board/write`}>
            <button className="text-gray-900 border border-gray-100 focus:outline-none bg-white hover:bg-gray-100 focus:ring-1 focus:ring-gray-300 font-medium text-sm px-2 py-1.5 flex items-center">
              <RiFileList2Line className="mr-2" />
              글쓰기
            </button>
          </Link>
          <BoardCategory categories={categories} selectedCategory={selectedCategory} onSelectCategory={navigateCategory} />
        </div>
        <div className="laptop:w-[47.6875rem] w-mainContent">
          {/* <h1 className="text-black text-2xl mt-5">
            게시판 랜딩 페이지
          </h1> */}
          {/* 인기 게시글 섹션 */}
          {/* <PopularPosts /> */}
          {/* 장식 이미지들/페이지 대문 */}
          <img src="/src/assets/banner.png" alt="" className="min-h-96" />
          {/* 카테고리별 최신 게시글 섹션 */}
          <div className="flex mt-5">
            <div className="w-1/2">
              <LatestPosts />
            </div>
            <div className="w-1/2">
              <LatestPostsByCategory categoryId={27} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Board;
