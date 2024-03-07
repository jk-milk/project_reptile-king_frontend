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

  console.log(post)

  return (
    <div className="w-body m-auto">
      <div className="flex">
        <BoardCategory categories={categories} selectedSubCategory={selectedSubCategory} setSelectedSubCategory={setSelectedSubCategory} />
        <div className="w-mainContent">
          <PostDetail post={post} />
        </div>
        <PopularPosts posts={posts} />
      </div>
    </div>
  )
}

export default BoardDetail;
