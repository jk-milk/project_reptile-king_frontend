import { useNavigate } from 'react-router-dom';
import { PostCategory } from '../../types/Board';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '../../config';

function BoardCategory() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("전체 게시글"); // 선택된 세부 카테고리

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesResponse = await axios.get(API+'categories');

      setCategories(categoriesResponse.data);
    };

    fetchCategories();
  }, []);

  // 상위 카테고리들만 추출
  const mainCategories = categories.filter(category => category.main_category === null);

  // 해당 상위 카테고리에 속한 하위 카테고리를 찾는 함수
  const findSubCategories = (mainCategoryId: number) => {
    return categories.filter(category => category.main_category === mainCategoryId);
  };


  // 세부 카테고리 설정 후 이동
  const selectCategoryAndNavigate = (category: string) => {
    setSelectedCategory(category);
    navigate(`/board/lists?category=${category}`) // /board/lists?id=category
  };

  return (
    <div className="w-52 mr-20">
      <div className="mt-28">
        {mainCategories.map((mainCategory) => (
          <div key={mainCategory.id} className="w-full p-2">
            <div className="border-b-2 pb-2">
              <p className="text-lg text-white ps-2">
                {mainCategory.title}
              </p>
            </div>
            <ul className="w-full pt-2 pb-4">
              {findSubCategories(mainCategory.id).map((subCategory) => (
                <li key={subCategory.title}>
                  <button
                    className={
                      selectedCategory === subCategory.link
                        ? "ps-2 py-0.5 text-white font-bold hover:underline"
                        : "ps-2 py-0.5 text-white hover:font-bold hover:underline"
                    }
                    onClick={() => selectCategoryAndNavigate(subCategory.link!)}
                  >
                    {subCategory.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoardCategory;
