import { useEffect, useState } from 'react';
import { Link, useSearchParams } from "react-router-dom";
import PostList from '../components/Board/PostList';
import BoardCategory from '../components/Board/BoardCategory';
import FilterButtons from '../components/Board/FilterButtons';
import PopularPosts from '../components/Board/PopularPosts';
import Pagination from '../components/Board/Pagination';
import { apiWithAuth, apiWithoutAuth } from '../components/common/axios';
import { RiFileList2Line } from "react-icons/ri";
import { API } from '../config';
import { Post, PostCategory, SelectedCategory } from '../types/Board';
import { Category } from '../types/Category';
import SearchBar from '../components/Board/SearchBar';

function Posts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>({ name: "전체 게시글", id: null }); // 선택된 세부 카테고리
  const [title, setTitle] = useState<string>(); // 게시글 상단 문자열

  const [posts, setPosts] = useState<Post[] | null>(null);
  console.log(posts);

  const [sort, setSort] = useState("latest"); // 정렬 방식

  const LIKES_NUMBER = 5; // 인기글 조건: 좋아요 수 LIKES_NUMBER 이상인 글들이 인기글
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    lastPage: 1,
    links: [],
  });
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

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

  // 전체 게시글 가져오는 함수
  const fetchPosts = async (sort: string = 'latest', page: number = 1) => {
    const response = await apiWithoutAuth.get(`${API}posts`, {
      params: {
        sort,
        page,
      }
    });
    console.log(response.data);
    setPosts(response.data.data);
    // setCurrentPage(response.data.current_page);
    // setTotalPages(response.data.last_page);
    setPaginationData({
      currentPage: response.data.current_page,
      lastPage: response.data.last_page,
      links: response.data.links,
    });
  };

  // 카테고리 기준 게시글 데이터 가져오는 함수
  const fetchPostsByCategory = async (category_id: number, sort: string = 'latest', page: number = 1) => {
    const response = await apiWithoutAuth.get(`${API}posts/category/${category_id}`, {
      params: {
        sort,
        page,
      }
    });
    setPosts(response.data.data);
    setPaginationData({
      currentPage: response.data.current_page,
      lastPage: response.data.last_page,
      links: response.data.links,
    });
  }

  // 검색어 기준 게시글 데이터 가져오는 함수
  const fetchPostsBySearch = async (search: string) => {
    const response = await apiWithAuth.get(`${API}posts/search`, {
      params: {
        search
      },
    });
    setPosts(response.data.data);
    setPaginationData({
      currentPage: response.data.current_page,
      lastPage: response.data.last_page,
      links: response.data.links,
    });
  };

  // 글 가져오기
  useEffect(() => {
    const categoryId = searchParams.get('category');
    const search = searchParams.get('search');
    if (categoryId === null) {
      if (search === null)
        fetchPosts('latest', currentPage);
      else {
        // 검색어 기준 게시글 데이터 가져오는 함수
        fetchPostsBySearch(search);
      }
    }
    else { // 쿼리스트링에서 카테고리가 있는 경우
      console.log("쿼리스트링에서 카테고리가 있는 경우", sort);
      
      fetchPostsByCategory(Number(categoryId), sort, currentPage);
      // 카테고리 ID를 사용해 카테고리 이름 찾고 게시판 상단 문자열 변경
      const subCategory = categories
        .flatMap(category => category.subPosts || []) // subPosts가 없는 경우를 대비해 빈 배열을 반환
        .find(subPost => subPost.id === Number(categoryId));
      if (subCategory) {
        setTitle(subCategory.name);
      }
    }
  }, [categories, currentPage, searchParams, sort])

  // 카테고리를 선택하면 이동
  const NavigateCategory = (id: number) => {
    console.log(id);
    console.log(categories);

    const category = categories.find((category) => category.subPosts.find(category => category.id === id));
    console.log(category);

    if (category) {
      setSelectedCategory({ name: category.name, id: category.id });
      setSearchParams({ category: id.toString() }); // 다른 쿼리스트링을 모두 삭제하고 category만 추가
    }
  };

  // 검색어 입력 핸들러
  const handleSearchChange = (search: string) => {
    // setSearchParams({ ...Object.fromEntries(searchParams), search });
    setSearchParams({ search: search });
  };

  // 탭 선택 핸들러
  const handleSortChange = (sort: string) => {
    if (sort === '') {
      console.log(sort, "빈문자열");
      setSort('latest')
      searchParams.delete('sort');
      setSearchParams({ ...Object.fromEntries(searchParams) });
    } else {
      setSort(sort)
      setSearchParams({ ...Object.fromEntries(searchParams), sort: sort });
    }
  }

  // 페이지네이션 클릭 시 페이지 이동. 쿼리 스트링에 page 파라미터 추가
  const handlePageChange = (page: number) => {
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
  };

  return (
    <div className="pt-10 pb-10 laptop:w-[67.5rem] w-body m-auto">
      <div className="bg-white rounded px-5 py-4 flex">
        {/* <div className="laptop:w-[75rem] w-body m-auto flex"> */}
        <div>
          <SearchBar handleSearchChange={handleSearchChange} />
          <BoardCategory categories={categories} selectedCategory={selectedCategory} onSelectCategory={NavigateCategory} />
        </div>
        <div className="laptop:w-[47.6875rem] w-mainContent">
          <h1 className="text-2xl mt-5 pb-5">
            {title}
          </h1>
          <div className="flex justify-between">
            <div>
              <FilterButtons
                handleSortChange={handleSortChange}
                sort={sort}
              />
            </div>
            <Link to={`/board/write`}>
              <button className="text-gray-900 border border-gray-100 focus:outline-none bg-white  hover:bg-gray-100 focus:ring-1 focus:ring-gray-300 font-semibold text-sm pl-2 pr-2 py-1.5">
                <RiFileList2Line className="inline-block pe-1 pb-1" />
                글쓰기
              </button>
            </Link>
          </div>
          <PostList posts={posts} />
          {/* <Pagination
            totalPosts={totalPosts}
            postsPerPage={POSTS_PER_PAGE}
            currentPage={currentPage}
            paginate={paginate}
          /> */}
          <Pagination paginationData={paginationData} onPageChange={handlePageChange} />
        </div>
        {/* <PopularPosts /> */}
      </div>
    </div>
  )
}

export default Posts;
