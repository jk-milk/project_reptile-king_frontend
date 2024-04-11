import { useState, useEffect, useRef } from 'react';

interface DropdownProps {
  items: string[];
  selectedItem: string;
  setSelectedItem: (item: string) => void;
}

function Dropdown({ items, selectedItem, setSelectedItem }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-48" ref={dropdownRef} >
      <button className="m-2 p-2 w-44 border border-gray-400 text-gray-900 bg-white focus:ring-2 focus:outline-none focus:ring-gray-300 font-semibold rounded inline-flex items-center justify-between" onClick={() => setIsOpen(!isOpen)}>
        {selectedItem}
        <svg className="w-2.5 h-2.5 ms-1 mt-0.5 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>
      {isOpen && (
        <ul className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow mt-1 ml-2 w-44">
          {items.map((item, index) => (
            <li
              key={index}
              className="block text-sm text-gray-700 px-4 py-2 w-full text-left hover:bg-gray-100 cursor-pointer"
              onClick={() => {                
                setSelectedItem(item);
                setIsOpen(false);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
