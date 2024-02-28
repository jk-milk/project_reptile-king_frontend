import axios from 'axios';
import { useEffect, useState } from 'react';
import BoardCategory from "../components/Board/BoardCategory"
import MainContent from '../components/Board/MainContent';

function Board() {
  const categories = [
    {
      title: "홈",
      subCategories: ["home", "rules", "hot"],
      link: "home",
    },
    {
      title: "잡담 & 꿀팁",
      subCategories: ["사육", "핫딜", "주의점", "사육"],
      link: "talk",
    },
    {
      title: "분양",
      link: "adoption",
    },
  ];

  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      // const response = await axios.get('http://localhost:8080/api/posts'); // 실제 api
      const response = await axios.get('http://localhost:3300/posts'); // json server
      setPosts(response.data);
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex">
      <div className="w-1/4">
        Search
        <BoardCategory categories={categories} />
      </div>
      <div className="w-1/2">
        메인컨텐츠
        <MainContent posts={posts} />
      </div>
      <div  className="w-1/4">
        우측 사이드바
      </div>
    </div>
  )
}

export default Board