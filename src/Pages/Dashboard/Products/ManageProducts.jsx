import React, { useEffect, useState } from "react";
import { FaEdit, FaPlusSquare } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import SectionTitle from "../../../Components/SectionTitle/SectionTitle";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Pagination from "../../../Components/Pagination/Pagination";

const ManageProducts = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  // Search field
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Pagination state
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;

  // Fetch products using React Query
  const fetchProducts = async () => {
    const response = await fetch(
      "https://store-management-app-server.vercel.app/products"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return response.json();
  };

  // Use useQuery to fetch data
  const {
    data: products = [], // Ensure products is always an array
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // Filter products based on search term
  useEffect(() => {
    if (products.length > 0) {
      const filtered = products.filter(
        (item) =>
          item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.subCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
      setPageCount(Math.ceil(filtered.length / itemsPerPage));
      setItemOffset(0);
    }
  }, [products, searchTerm]);

  // Update pagination items
  useEffect(() => {
    setCurrentItems(
      filteredProducts.slice(itemOffset, itemOffset + itemsPerPage)
    );
  }, [filteredProducts, itemOffset]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredProducts.length;
    setItemOffset(newOffset);
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-2 mt-12">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500 border-solid"></div>
        <p className="text-blue-500 text-lg font-semibold">
          Loading products...
        </p>
      </div>
    );
  }

  // Handle Delete Product
  const handleDeleteItem = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosPublic.delete(`/products/${item._id}`);
        if (res.data.deletedCount > 0) {
          refetch();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${item.category} deleted successfully.`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    });
  };

  return (
    <div>
      <SectionTitle
        subHeading="Manage your products"
        heading="Manage Products"
      />

      {/* Top Bar - Add Button & Search */}
      <div className="flex justify-normal gap-4 items-center mx-16 mt-4">
        <button
          onClick={() => navigate("/dashboard/add-products")}
          className="btn btn-primary"
        >
          Add New Product
        </button>
        <input
          type="text"
          placeholder="Search by category, subcategory, or brand"
          className="input input-bordered w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Product Table */}
      <div className="mx-16 mt-8 mb-4">
        <div className="overflow-x-auto">
          <table className="table w-full border border-gray-300">
            <thead className="text-center bg-cyan-900 text-white">
              <tr className="text-base border border-cyan-300">
                <th>Update</th>
                <th>#</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Subsubcat.</th>
                <th>Brand</th>
                <th>Pdt Code</th>
                <th>In Stock</th>
                <th>Stock Alert</th>
                <th>Cost (RMB)</th>
                <th>Price (RMB)</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr
                  key={item._id}
                  className={`text-cyan-950 border border-gray-300 ${
                    index % 2 === 0 ? "bg-blue-50" : "bg-gray-50"
                  }`}
                >
                  <td>
                    <Link to={`/dashboard/update-products/${item._id}`}>
                      <button className="btn btn-ghost text-2xl text-orange-500">
                        <FaPlusSquare />
                      </button>
                    </Link>
                  </td>
                  <td>{index + 1}</td>
                  <td>{item.category}</td>
                  <td>{item.subCategory}</td>
                  <td>{item.subsubCategory}</td>
                  <td>{item.brand}</td>
                  <td>{item.productCode}</td>
                  <td>{item.inStock}</td>
                  <td>{item.stockAlert}</td>
                  <td>{item.costRMB}</td>
                  <td>{item.productPrice}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td className="flex space-x-2">
                    {/* Edit Button */}
                    <Link to={`/dashboard/update-products/${item._id}`}>
                      <button className="btn btn-ghost text-2xl text-blue-500">
                        <FaEdit />
                      </button>
                    </Link>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="btn btn-ghost text-2xl text-red-500"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <Pagination pageCount={pageCount} onPageChange={handlePageClick} />
      </div>
    </div>
  );
};

export default ManageProducts;
