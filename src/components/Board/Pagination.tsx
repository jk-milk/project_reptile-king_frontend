import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
  paginationData: {
    currentPage: number;
    lastPage: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
  };
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ paginationData, onPageChange }) => {
  if (!paginationData.links.length) {
    // If the links array is empty, return null to avoid rendering the pagination
    return null;
  }

  const { currentPage, lastPage, links } = paginationData;

  const handlePageClick = (url: string | null, page: number) => {
    if (url) {
      onPageChange(page);
    }
  };

  return (
    <nav className="flex justify-center items-center space-x-2 my-8">
      <button
        className={`px-3 py-2 rounded-md transition-colors ${
          links[0].active ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-100'
        }`}
        onClick={() => handlePageClick(links[0].url, currentPage - 1)}
        disabled={links[0].active}
      >
        <FiChevronLeft size={16} />
      </button>

      {links.slice(1, -1).map((link, index) => (
        <button
          key={index}
          className={`px-3 py-2 rounded-md transition-colors ${
            link.active
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'text-blue-500 hover:bg-blue-100'
          }`}
          onClick={() => handlePageClick(link.url, parseInt(link.label))}
          disabled={link.active}
        >
          {link.label}
        </button>
      ))}

      <button
        className={`px-3 py-2 rounded-md transition-colors ${
          links[links.length - 1].active
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-blue-500 hover:bg-blue-100'
        }`}
        onClick={() => handlePageClick(links[links.length - 1].url, currentPage + 1)}
        disabled={links[links.length - 1].active}
      >
        <FiChevronRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
