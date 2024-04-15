import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuillEditor from "../components/Board/QuillEditor";
import Dropdown from "../components/common/Dropdown";
import { API } from "../config";
import { apiWithAuth } from "../components/common/axios";
import { Category } from "../types/Category";
import { selectedCategory } from "../types/Board";

function BoardWrite() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<selectedCategory>({ name: "카테고리 선택", id: null });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<selectedCategory>({ name: "세부 카테고리 선택", id: null });
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 카테고리를 서버에 요청하여 가져옴
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await apiWithAuth.get(API + "categories");
      const postsCategories = response.data.filter((data: Category) => data.division === "posts");

      setCategories(postsCategories);
    };

    fetchCategories();
  }, []);

  // 선택된 카테고리에 따라 세부 카테고리를 가져옴
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (selectedCategory.name !== "카테고리 선택") {
        const response = await apiWithAuth.get(API + "categories");
        const subCategories = response.data.filter((data: Category) => data.parent_id == selectedCategory.id); // parent_id가 string이라 == 사용

        setSubCategories(subCategories);
      }
    };

    fetchSubCategories();
  }, [selectedCategory]);

  // 사용자가 등록 버튼을 눌렀을 경우
  const handleSubmit = async () => {
    if (selectedCategory.id === null) {
      alert("카테고리를 선택해 주세요!")
      return;
    } else if (selectedSubCategory.id === null) {
      alert("세부 카테고리를 선택해 주세요!")
      return;
    } else if (!title) {
      alert("제목을 입력해 주세요!")
      return;
    } else if (!content) {
      alert("제목을 입력해 주세요!")
      return;
    }

    const postData = {
      title,
      content,
      category_id: selectedSubCategory.id
    };
    
    try {
      const response = await apiWithAuth.post(API + "posts", postData);
      console.log(response);

      alert("글 작성 완료!");
      navigate(`/board/lists?category=${selectedCategory.id}`);
    } catch (error) {
      console.error('서버 오류', error);
      alert("서버 오류! 다시 등록해 주세요.");
    }
  };

  // 취소 버튼을 눌렀을 때 동작
  const handleCancel = () => {
    // 글 목록 페이지로 이동
    navigate("/board/lists");
  };

  return (
    <div className="laptop:w-[75rem] w-body m-auto flex">
      <div className="laptop:w-[75rem] w-body mb-10">
        <h1 className="text-white text-2xl mt-5">
          글쓰기
        </h1>
        <div className="mb-4 p-2 min-h-[35rem] bg-gray-200 rounded">
          <div className="flex">
            <Dropdown
              items={categories}
              selectedItem={selectedCategory}
              setSelectedItem={setSelectedCategory}
            />
            <Dropdown
              items={subCategories}
              selectedItem={selectedSubCategory}
              setSelectedItem={setSelectedSubCategory}
              disabled={selectedCategory.name === "카테고리 선택"}
            />
          </div>

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
              className="mt-8 mb-4 ml-auto mr-2 p-1 w-20 rounded border border-gray-500 text-white bg-gray-600 focus:ring-2 focus:outline-none"
              onClick={handleCancel}
            >
              취소
            </button>
            <button
              className="mt-8 mb-4 mr-2 p-1 w-20 rounded border border-gray-500 text-white bg-blue-600 focus:ring-2 focus:outline-none"
              onClick={handleSubmit}
            >
              등록
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoardWrite;
