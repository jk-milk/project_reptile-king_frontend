import { useNavigate } from 'react-router-dom';
import { PostCategory } from '../../types/Board';
import { useEffect, useState } from 'react';
import axios from 'axios';
// import { API } from '../../config';

const BoardCategory = () => {

  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("전체 게시글"); // 선택된 세부 카테고리

  useEffect(() => {
    const fetchCategories = async () => {
      // const categoriesResponse = await axios.get(API+'categories'); // 실제 api
      const categoriesResponse = await axios.get('http://localhost:3300/categories'); // json server

      setCategories(categoriesResponse.data);
    };

    fetchCategories();
  }, []);

  const navigate = useNavigate();

  // 세부 카테고리 설정 후 이동
  const handleSetSubCategory = (link: string) => {
    setSelectedSubCategory(link);
    navigate(`/board/category/${link}`);
  };

  return (
    <div className="w-52 mr-20">
      <div className="mt-28">
        {categories.map((category) => (
          <div key={category.id} className="w-full p-2">
            <div className="border-b-2 pb-2">
              <p className="text-lg text-white ps-2">
                {category.category}
              </p>
            </div>
            <ul className="w-full pt-2 pb-4">
              {category.subCategories.map((subCategory) => (
                <li key={subCategory.title}>
                  <button
                    className={
                      selectedSubCategory === subCategory.title
                        ? "ps-2 py-0.5 text-white font-bold hover:underline"
                        : "ps-2 py-0.5 text-white hover:font-bold hover:underline"
                    }
                    onClick={() => handleSetSubCategory(subCategory.link)}
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
