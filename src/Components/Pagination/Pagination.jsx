import React from "react";
import ReactPaginate from "react-paginate";

const Pagination = ({ pageCount, onPageChange }) => {
  return (
    <ReactPaginate
      previousLabel="&lt; Previous"
      nextLabel="Next &gt;"
      pageCount={pageCount}
      onPageChange={onPageChange}
      containerClassName="flex items-center mt-6 mb-8 space-x-4 bg-base-200 shadow-sm rounded-lg p-2"
      pageLinkClassName="px-3 py-1 border rounded hover:bg-gray-400 hover:text-white transition duration-300"
      previousLinkClassName="px-3 py-1 border rounded hover:bg-blue-500 hover:text-white transition duration-300"
      nextLinkClassName="px-3 py-1 border rounded hover:bg-blue-400 hover:text-white transition duration-300"
      activeClassName="bg-blue-500 text-white rounded"
    />
  );
};

export default Pagination;
