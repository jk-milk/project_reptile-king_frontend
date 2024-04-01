import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Post } from '../types/Board';
import BoardCategory from '../components/Board/BoardCategory';
import PopularPosts from '../components/Board/PopularPosts';
import BoardDetailMainContent from '../components/Board/BoardDetailMainContent';

function BoardDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      // const postsResponse = await axios.get('http://localhost:8080/api/posts'); // 실제 api
      const postsResponse = await axios.get(`http://localhost:3300/posts/${postId}`); // json server

      // const postDetail = postsResponse.data.find((post: Post) => post.id === Number(postId));
      const postDetail = postsResponse.data;
      setPost(postDetail);
    };

    fetchPosts();
  }, [postId]);

  return (
    <div className="laptop:w-[75rem] w-body m-auto flex">
      <BoardCategory />
      <div className="laptop:w-[47.6875rem] w-mainContent">
        <BoardDetailMainContent post={post} />
      </div>
      <PopularPosts />
    </div>
  )
}

export default BoardDetail;
