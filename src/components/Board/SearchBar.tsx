import { ChangeEvent, FormEvent, useState } from "react";
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

// 게시판 검색창
function SearchBar() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/board/lists?search=${inputValue}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 flex">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="max-w-40 border-s border-y border-gray-300 rounded-s-md text-sm ml-2 px-4 py-2 leading-tight focus:outline-none focus:border-green-500"
      />
      <button
        type="submit"
        className="text-white bg-green-500 border-y border-e border-green-500 rounded-e-md leading-tight focus:outline-none focus:border-green-500 font-semibold text-lg px-2 py-2"
      >
        <FaSearch />
      </button>
    </form>
  );
}

export default SearchBar;
