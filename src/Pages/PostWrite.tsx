import { useEffect, useState } from "react";
import BoardCategory from "../components/Board/BoardCategory";
import { Post, PostCategory } from "../types/Board";
import axios from "axios";
import PopularPosts from "../components/Board/PopularPosts";

function PostWrite() {
  
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("전체 게시글"); // 선택된 세부 카테고리

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
  });


  return(
    <div className="laptop:w-[75rem] w-body m-auto flex">
      <BoardCategory categories={categories} selectedSubCategory={selectedSubCategory} setSelectedSubCategory={setSelectedSubCategory} />
      <div className="laptop:w-[47.6875rem] w-mainContent">
        ㅇ
      </div>
      <PopularPosts posts={posts} />
    </div>
  )
}

export default PostWrite;
