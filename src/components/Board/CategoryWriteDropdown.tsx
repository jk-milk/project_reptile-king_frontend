import { useEffect, useState } from "react";
import { PostCategory } from "../../types/Board";
import axios from "axios";
import { API } from "../../config";

interface CategoryWriteDropdownProps {
  setCategory: (category: string) => void;
  setDropdownOpen: (open: boolean) => void;
}

function CategoryWriteDropdown({ setCategory, setDropdownOpen }: CategoryWriteDropdownProps) {
  const [categories, setCategories] = useState<PostCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesResponse = await axios.get(API + 'categories');
      const filteredData = categoriesResponse.data.filter((category: { main_category: number | null; }) => category.main_category !== null);
      setCategories(filteredData);
    };

    fetchCategories();
  }, []);

  const categoryTitles = categories.map(category =>
    category.title
  ).slice(1);

  return (
    <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow mt-1 ml-2 w-44">
      <ul className="py-2 text-sm text-gray-700">
        {categoryTitles.map((title, index) => (
          <li key={index}>
            <button onClick={() => { setCategory(title); setDropdownOpen(false); }} className="block px-4 py-2 w-full text-left hover:bg-gray-100">{title}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CategoryWriteDropdown;
