import axios from 'axios';
import { useEffect, useState } from 'react';
import PostList from '../components/Board/PostList';
import { Post, PostCategory } from '../types/Board';

function Board() {

  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null); // 선택된 세부 카테고리

  useEffect(() => {
    const fetchPosts = async () => {
      // const categoriesResponse = await axios.get('http://localhost:8080/categories');
      // const postsResponse = await axios.get('http://localhost:8080/api/posts'); // 실제 api
      const categoriesResponse = await axios.get('http://localhost:3300/categories');
      const postsResponse = await axios.get('http://localhost:3300/posts'); // json server

      setCategories(categoriesResponse.data);
      setPosts(postsResponse.data);
    };

    fetchPosts();
  }, []);

  // 선택된 세부 카테고리에 따라 게시물 필터링
  const filteredPosts = selectedSubCategory
  ? (selectedSubCategory === "전체 게시글" // 전체 게시글 카테고리일 경우 전체 출력
    ? posts
    : posts.filter(post => post.category === selectedSubCategory))
  : posts; // 아무것도 선택되지 않았을 경우

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
          <PostList posts={filteredPosts} />
        </div>
        <div className="w-1/4">
          우측 사이드바
        </div>
      </div>
    )
  }
  
  export default Board
