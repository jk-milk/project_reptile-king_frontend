import { useEffect, useState } from "react";
import { PostCategory } from "../../types/Board";
import axios from "axios";

interface CategoryWriteDropdownProps {
  setSubCategory: (category: string) => void;
  setDropdownOpen: (open: boolean) => void;
}

function CategoryWriteDropdown({ setSubCategory, setDropdownOpen }: CategoryWriteDropdownProps) {
  const [categories, setCategories] = useState<PostCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      // const categoriesResponse = await axios.get(API+'categories'); // 실제 api
      const categoriesResponse = await axios.get('http://localhost:3300/categories'); // json server

      setCategories(categoriesResponse.data);
    };

    fetchCategories();
  }, []);

  const subCategoryTitles = categories.flatMap(category =>
    category.subCategories.map(subCategory => subCategory.title)
  ).slice(1);


  return (
    <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow mt-1 ml-2 w-44">
      <ul className="py-2 text-sm text-gray-700">
        {subCategoryTitles.map((title, index) => (
          <li key={index}>
            <button onClick={() => { setSubCategory(title); setDropdownOpen(false); }} className="block px-4 py-2 w-full text-left hover:bg-gray-100">{title}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CategoryWriteDropdown;