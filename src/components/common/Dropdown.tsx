import { useState, useEffect, useRef } from 'react';

interface Item {
  id: number | null;
  name: string;
}
interface DropdownProps {
  items: Item[];
  selectedItem: Item;
  setSelectedItem: (item: Item) => void;
  disabled?: boolean;
}

function Dropdown({ items, selectedItem, setSelectedItem, disabled = false }: DropdownProps) {
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
    <div className="w-96" ref={dropdownRef} >
      <button 
        className={`m-2 p-2 w-80 border border-gray-400 text-gray-900 bg-white focus:ring-2 focus:outline-none focus:ring-gray-300 font-semibold rounded inline-flex items-center justify-between ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {selectedItem.name}
        <svg className="w-2.5 h-2.5 ms-1 mt-0.5 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>
      {isOpen && !disabled && ( // 열려 있지 않거나 disabled 상태에서는 드롭다운 목록 표시 x
        <ul className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow mt-1 ml-2 w-80">
          {items.map((item, index) => (
            <li
              key={index}
              className="block text-sm text-gray-700 px-4 py-2 w-full text-left hover:bg-gray-100 cursor-pointer"
              onClick={() => {                
                setSelectedItem(item);
                setIsOpen(false);
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
