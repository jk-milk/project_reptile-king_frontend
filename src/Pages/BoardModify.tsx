import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API } from "../config";
import BoardCategory from "../components/Board/BoardCategory";
import PopularPosts from "../components/Board/PopularPosts";
import QuillEditor from "../components/Board/QuillEditor";
import { apiWithAuth, apiWithoutAuth } from "../components/common/axios";

function BoardModify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const postId = searchParams.get("id");
  const category_id = searchParams.get("category");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (category_id === null || postId === null) {
      alert("잘못된 접근입니다!");
      navigate("/board");
      return;
    }

    const fetchPosts = async () => {
      try {
        const postResponse = await apiWithoutAuth.get(`${API}posts/${postId}`);
        setTitle(postResponse.data.title);
        setContent(postResponse.data.content);
        const categoryResponse = await apiWithoutAuth.get(`${API}categories/${category_id}`);
        setCategory(categoryResponse.data.title);
      } catch (err) {
        alert("잘못된 경로입니다!");
        navigate("/board");
      }
    };

    fetchPosts();
  }, [category_id, postId, navigate]);

  const handleSubmit = async () => {
    if (!title) {
      alert("제목을 입력해 주세요!")
      return;
    }

    const postData = {
      category_id,
      title,
      content,
    };

    try {
      const response = await apiWithAuth.patch(API + "posts", postData);
      console.log(response.data);
      // response로 카테고리 링크를 받아와야 함
      alert("글 작성 완료!");
      navigate(`/board/lists?category=${category}`);
    } catch (error) {
      console.error('서버 오류', error);
      alert("서버 오류! 다시 등록해 주세요.");
    }
  };

  return (
    <div className="laptop:w-[75rem] w-body m-auto flex">
      <div className="mt-20">
        <BoardCategory />
      </div>
      <div className="laptop:w-[47.6875rem] w-mainContent">
        <h1 className="text-white text-2xl mt-5 pb-5">
          글쓰기
        </h1>
        <div className="mb-4 p-2 min-h-[35rem] bg-gray-200 rounded">
          <div className="my-4 mx-2">
            <input
              className="p-2 w-full border border-gray-400 text-gray-900 bg-white focus:ring-2 focus:outline-none focus:ring-gray-300 rounded inline-flex items-center"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="제목을 입력해 주세요."
            />
          </div>
          <QuillEditor setContent={setContent} />
          <div className="flex">
            <button
              className="mt-8 mb-4 ml-auto mr-2 p-1 w-20 rounded border border-gray-500 text-gray-900 bg-white focus:ring-2 focus:outline-none"
              onClick={handleSubmit}
            >
              등록
            </button>
          </div>
        </div>
      </div>
      <PopularPosts />
    </div>
  )
}

export default BoardModify;
