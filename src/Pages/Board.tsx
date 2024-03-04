import axios from 'axios';
import { useEffect, useState } from 'react';
import PostList from '../components/Board/PostList';
import { Post, PostCategory } from '../types/Board';

function Board() {

  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null); // 선택된 세부 카테고리
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
    <div className="flex">
      <div className="w-1/4">
        Search
        {categories.map((category) => (
          <div key={category.id} className="w-full p-2">
            <div className="border-b-2 pb-2">
              <div className="text-lg text-white">
                {category.category}
              </div>
            </div>
            <ul className="mt-2 w-full">
              {category.subCategories.map((subCategory) => (
                <li key={subCategory.title}>
                  <button
                    className={
                      selectedSubCategory === subCategory.title
                        ? "py-2 text-white font-bold underline underline-offset-4"
                        : "py-2 text-white hover:font-bold"
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
      <div className="w-1/2">
        <button onClick={() => setFilter('전체글')}>전체글</button>
        <button onClick={() => setFilter('인기글')}>인기글</button>
        <select 
          value={sort} 
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="등록순">등록순</option>
          <option value="최신순">최신순</option>
          {/* <option value="댓글순">댓글순</option> */}
        </select>
        <PostList posts={filteredPosts} />
      </div>
      <div className="w-1/4">
        우측 사이드바
      </div>
    </div>
  )
}

export default Board
