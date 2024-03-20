import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Post, PostCategory } from '../types/Board';
import BoardCategory from '../components/Board/BoardCategory';
import PopularPosts from '../components/Board/PopularPosts';
import PostDetail from '../components/Board/PostDetail';

function BoardDetail() {
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("전체 게시글"); // 선택된 세부 카테고리
  const [posts, setPosts] = useState<Post[]>([]);

  const { detailId } = useParams<{ detailId: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      // const categoriesResponse = await axios.get('http://localhost:8080/categories'); // 실제 api
      // const postsResponse = await axios.get('http://localhost:8080/api/posts');
      const categoriesResponse = await axios.get('http://localhost:3300/categories'); // json server
      const postsResponse = await axios.get('http://localhost:3300/posts');

      setCategories(categoriesResponse.data);
      setPosts(postsResponse.data);
      const postDetail = postsResponse.data.find((post: Post) => post.id === Number(detailId));
      setPost(postDetail);
    };

    fetchPosts();
  }, [detailId]);

  return (
    <div className="laptop:w-[75rem] w-body m-auto flex">
      <BoardCategory categories={categories} selectedSubCategory={selectedSubCategory} setSelectedSubCategory={setSelectedSubCategory} />
      <div className="laptop:w-[47.6875rem] w-mainContent">
        <h1 className="text-white text-2xl mt-5 pb-5">
          {selectedSubCategory}
        </h1>
        <PostDetail post={post} />
      </div>
      <PopularPosts posts={posts} />
    </div>
  )
}

export default BoardDetail;
