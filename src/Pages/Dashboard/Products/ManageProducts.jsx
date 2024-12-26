import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import SectionTitle from "../../../Components/SectionTitle/SectionTitle";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { FaPlusSquare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../Components/Pagination/Pagination";

const ManageProducts = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  // Pagination state
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;

  // Fetch products when the component mounts
  const fetchProducts = async () => {
    const response = await fetch(
      "https://store-management-app-server.vercel.app/products"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return response.json();
  };

  // Use useQuery to fetch the data and handle loading and error states
  const {
    data: products = [], // default to an empty array
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // Handle Pagination Changes (without re-triggering products fetch)
  useEffect(() => {
    if (products.length > 0) {
      const sortedProducts = [...products].sort((a, b) => {
        // Sort by brand in descending order (Z to A)
        if (a.brand !== b.brand) {
          return b.brand.localeCompare(a.brand);
        }
        // Sort by subCategory in ascending order if brands are the same
        if (a.subCategory !== b.subCategory) {
          return a.subCategory.localeCompare(b.subCategory);
        }
        // Sort by subsubCategory in ascending order if brands and subCategory are the same
        return a.subsubCategory.localeCompare(b.subsubCategory);
      });

      setPageCount(Math.ceil(sortedProducts.length / itemsPerPage));
      setCurrentItems(
        sortedProducts.slice(itemOffset, itemOffset + itemsPerPage)
      );
    }
  }, [products, itemOffset]);

  // Handle pagination click
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % products.length;
    setItemOffset(newOffset);
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-2 mt-12">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500 border-solid"></div>
        <p className="text-blue-500 text-lg font-semibold">
          Loading sales data...
        </p>
      </div>
    );
  }

  // Handle Delete
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
            title: `${item.category} is deleted successfully.`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    });
  };

  return (
    <div>
      <div>
        <SectionTitle
          subHeading="Manage your products"
          heading="Manage Products"
        />
      </div>
      <div className="flex justify-start items-center ml-16">
        <button
          onClick={() => navigate("/dashboard/add-products")}
          className="btn btn-primary"
        >
          Add New Product
        </button>
      </div>
      <div className="mx-16 mt-8 mb-4">
        <div className="overflow-x-auto">
          <table className="table w-full border border-gray-300">
            <thead className="text-center">
              <tr className="font-bold text-xl bg-gray-300 border border-gray-300">
                <th className="border-r border-gray-400">Update</th>
                <th className="border-r border-gray-400">#</th>
                <th className="border-r border-gray-400">Category</th>
                <th className="border-r border-gray-400">SubCategory</th>
                <th className="border-r border-gray-400">SubsubCategory</th>
                <th className="border-r border-gray-400">Brand</th>
                <th className="border-r border-gray-400">Product Code</th>
                <th className="border-r border-gray-400">In Stock</th>
                <th className="border-r border-gray-400">Stock Alert</th>
                <th className="border-r border-gray-400">Cost at RMB</th>
                <th className="border-r border-gray-400">RMB Rate</th>
                <th className="border-r border-gray-400">Transport Cost</th>
                <th className="border-r border-gray-400">Product Cost</th>
                <th className="border-r border-gray-400">Product Price</th>
                <th className="border-r border-gray-400">Date</th>
                <th className="border-r border-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr
                  key={item._id}
                  className={`${
                    index % 2 === 0 ? "bg-blue-50" : "bg-gray-50"
                  } border border-gray-300`}
                >
                  <td className="border border-gray-300">
                    <Link to={`/dashboard/update-products/${item._id}`}>
                      <button className="btn btn-ghost text-2xl text-orange-500">
                        <FaPlusSquare />
                      </button>
                    </Link>
                  </td>
                  <td className="border border-gray-300">{index + 1}</td>
                  <td className="border border-gray-300">{item.category}</td>
                  <td className="border border-gray-300">{item.subCategory}</td>
                  <td className="border border-gray-300">
                    {item.subsubCategory}
                  </td>
                  <td className="border border-gray-300">{item.brand}</td>
                  <td className="border border-gray-300">{item.productCode}</td>
                  <td className="border border-gray-300">{item.inStock}</td>
                  <td className="border border-gray-300">{item.stockAlert}</td>
                  <td className="border border-gray-300">{item.costRMB}</td>
                  <td className="border border-gray-300">{item.rmbRate}</td>
                  <td className="border border-gray-300">
                    {item.transportCost}
                  </td>
                  <td className="border border-gray-300">{item.productCost}</td>
                  <td className="border border-gray-300">
                    {item.productPrice}
                  </td>
                  <td className="border border-gray-300">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="flex">
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
        <Pagination pageCount={pageCount} onPageChange={handlePageClick} />
      </div>
    </div>
  );
};

export default ManageProducts;
