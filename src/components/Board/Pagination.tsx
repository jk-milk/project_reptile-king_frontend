import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";

interface PaginationProps {
  totalPosts: number;
  postsPerPage: number;
  currentPage: number;
  paginate: (pageNumber: number) => void;
}

const Pagination = ({ paginationData, onPageChange }) => {
  if (!paginationData || paginationData.links.length === 0) return null;

  // 페이지 번호 추출 함수
  const extractPageNumber = (url) => {
    const match = url?.match(/page=(\d+)/);
    return match ? Number(match[1]) : null;
  };

  return (
    <ul className='flex list-none justify-center mb-4 pb-4 bg-[#f9f9f9] rounded-b'>
      {paginationData.links.map((link, index) => (
        <li key={index} className={`page-item ${link.url === null ? 'disabled' : ''}`}>
          <button
            className="page-link"
            // URL 대신 페이지 번호를 추출하여 onPageChange에 전달
            onClick={() => onPageChange(extractPageNumber(link.url))}
            disabled={link.url === null}
          >
            {link.label}
          </button>
        </li>
      ))}
    </ul>
  );
};


// function Pagination({ totalPosts, postsPerPage, currentPage, paginate }: PaginationProps) {
//   const pageNumbers = []; // 페이지 번호를 담을 배열
//   const lastPage = Math.ceil(totalPosts / postsPerPage); // 마지막 페이지 계산

//   // 페이지 번호 그룹 1-10, 11-20, ...
//   const pagesPerGroup = 10;
//   const currentGroup = Math.ceil(currentPage / pagesPerGroup); // 현재 페이지 그룹
//   const startPage = (currentGroup - 1) * pagesPerGroup + 1; // 현재 그룹의 시작 페이지 번호
//   const endPage = Math.min(startPage + pagesPerGroup - 1, lastPage); // 현재 그룹의 마지막 페이지 번호

//   for (let i = startPage; i <= endPage; i++) {
//     pageNumbers.push(i);
//   }

//   return (
//     <ul className='flex list-none justify-center mb-4 pb-4 bg-[#f9f9f9] rounded-b'>
//       {startPage > 1 && (
//         <>
//           <li className='mx-1'>
//             <button
//               onClick={() => paginate(1)}
//               className='pt-2.5'
//             >
//               <MdKeyboardDoubleArrowLeft />
//             </button>
//           </li>
//           <li className='mx-1'>
//             <button
//               onClick={() => paginate(startPage - 1)}
//               className='pt-2.5'
//             >
//               <MdKeyboardArrowLeft />
//             </button>
//           </li>
//         </>
//       )}
//       {pageNumbers.map(number => (
//         <li key={number} className='mx-1'>
//           <button
//             onClick={() => paginate(number)}
//             className={`w-9 h-9 rounded-md ${currentPage === number
//               ? 'border border-solid border-[#e5e5e5] bg-white text-[#03c75a] hover:underline'
//               : 'text-black hover:underline'
//               }`}
//           >
//             {number}
//           </button>
//         </li>
//       ))}
//       {endPage < lastPage && (
//         <>
//           <li className='mx-1'>
//             <button
//               onClick={() => paginate(endPage + 1)}
//               className='pt-2.5'
//             >
//               <MdKeyboardArrowRight />
//             </button>
//           </li>
//           <li className='mx-1'>
//             <button
//               onClick={() => paginate(lastPage)}
//               className='pt-2.5'
//             >
//               <MdKeyboardDoubleArrowRight />
//             </button>
//           </li>
//         </>
//       )}
//     </ul>
//   );
// }

export default Pagination;
