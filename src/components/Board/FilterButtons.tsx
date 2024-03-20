import { RiFileList2Line } from "react-icons/ri";
import { HiMiniFire } from "react-icons/hi2";

type FilterButtonsProps = {
  setFilter: (filter: string) => void;
  setSort: (sort: string) => void;
  sort: string;
  dropdownOpen: boolean;
  setDropdownOpen: (isOpen: boolean) => void;
}

const FilterButtons = ({ setFilter, sort, setSort, dropdownOpen, setDropdownOpen }: FilterButtonsProps) => {
  return (
    <div>
      <button className="text-gray-900 border border-gray-100 rounded-full focus:outline-none bg-white hover:bg-gray-100 focus:ring-1 focus:ring-gray-300 font-semibold text-sm mr-2 pl-2 pr-2 py-1.5"
              onClick={() => setFilter('전체글')}
      >
        <RiFileList2Line className="inline-block pe-1 pb-1" />
        전체글
      </button>
      <button className="text-white border border-red-700 rounded-full focus:outline-none bg-red-700 hover:bg-red-800 focus:ring-1 focus:ring-red-700 font-semibold text-sm mr-2 pl-2 pr-2 py-1.5"
              onClick={() => setFilter('인기글')}
      >
        <HiMiniFire className="inline-block pe-1 pb-1" />
        인기글
      </button>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="text-gray-900 border border-gray-100 bg-white hover:bg-gray-100 focus:ring-1 focus:outline-none focus:ring-gray-300 font-semibold text-sm pl-2 pr-2 py-1.5 rounded-full inline-flex items-center"
      >
        {sort}
        <svg className="w-2.5 h-2.5 ms-1 mt-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>
      {dropdownOpen &&
        <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow mt-1 ml-40 w-44">
          <ul className="py-2 text-sm text-gray-700">
            <li>
              <button onClick={() => { setSort('등록순'); setDropdownOpen(false); }} className="block px-4 py-2 w-full text-left hover:bg-gray-100">등록순</button>
            </li>
            <li>
              <button onClick={() => { setSort('최신순'); setDropdownOpen(false); }} className="block px-4 py-2 w-full text-left hover:bg-gray-100">최신순</button>
            </li>
            {/* 추후 '댓글순' 추가 가능 */}
          </ul>
        </div>
      }
    </div>
  );
};

export default FilterButtons;
