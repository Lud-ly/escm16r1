import React from "react";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  pageCount: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pageCount, onPageChange }) => {
  return (
    <div className="my-4 text-center">
      {/* Pagination */}
      <ReactPaginate
        previousLabel={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        }
        nextLabel={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        }
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={onPageChange}
        containerClassName="pagination flex justify-center list-none p-0"
        pageClassName="pagination__link mx-1 px-4 py-2 border border-red-800 text-blue-500 cursor-pointer"
        activeClassName="pagination__link--active bg-blue-500 text-white"
        previousClassName="pagination__link px-4 py-2 border border-red-800 text-blue-500 cursor-pointer"
        nextClassName="pagination__link px-4 py-2 border border-red-800 text-red-500 cursor-pointer"
        disabledClassName="pagination__link--disabled text-gray-400 cursor-not-allowed"
      />
    </div>
  );
};

export default Pagination;
