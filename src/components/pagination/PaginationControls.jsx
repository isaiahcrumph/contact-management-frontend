import React from 'react';

const PaginationControls = ({ currentPage, pageSize, totalCount, onPageChange }) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const canGoBack = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex justify-between items-center mt-4 text-sm text-gray-300">
      <span>
        Page {currentPage} of {totalPages || 1}
      </span>

      <div className="space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoBack}
          className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 hover:bg-gray-600 transition"
        >
          Prev
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 hover:bg-gray-600 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
