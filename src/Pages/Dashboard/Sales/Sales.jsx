import React, { useState, useEffect } from "react";
import useProducts from "../../../Hooks/useProducts";
import SectionTitle from "../../../Components/SectionTitle/SectionTitle";

import { MdDelete } from "react-icons/md";
// import { FaSearchPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import useCustomers from "../../../Hooks/useCustomers";
import { useNavigate } from "react-router-dom";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { FaSearchPlus, FaTimesCircle } from "react-icons/fa"; // Import out-of-stock icon

const Sales = () => {
  const navigate = useNavigate();
  const [products, refetch, isPending] = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermCx, setSearchTermCx] = useState(""); // Cx - Customer
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const axiosPublic = useAxiosPublic();
  // Fetch customer
  const [customers] = useCustomers();
  const [isLoading, setIsLoading] = useState(false);

  // Helper functions
  // Log selectedCustomer only when it changes
  useEffect(() => {
    console.log("selectedCustomer:", selectedCustomer);
  }, [selectedCustomer]);

  // Log selectedProducts only when they change
  useEffect(() => {
    console.log("selectedProducts:", selectedProducts);
  }, [selectedProducts]);

  // Filtered customers
  useEffect(() => {
    if (searchTermCx.trim() === "") {
      // Set filteredCustomers to an empty array if searchTerm is empty
      setFilteredCustomers([]);
      return;
    }

    const searchWords = searchTermCx.toLowerCase().split(" ");
    const results = customers.filter((customer) =>
      searchWords.every(
        (word) =>
          customer.name?.toLowerCase().includes(word) ||
          customer.mobile?.toLowerCase().includes(word) ||
          customer.address?.toLowerCase().includes(word)
      )
    );

    setFilteredCustomers(results);
  }, [searchTermCx]);

  // Filtered products
  useEffect(() => {
    if (searchTerm.trim() === "") {
      // Set filteredProducts to an empty array if searchTerm is empty
      setFilteredProducts([]);
      return;
    }

    const searchWords = searchTerm.toLowerCase().split(" ");
    const results = products.filter((product) =>
      searchWords.every(
        (word) =>
          product.brand?.toLowerCase().includes(word) ||
          product.category?.toLowerCase().includes(word) ||
          product.subCategory?.toLowerCase().includes(word) ||
          product.subsubCategory?.toLowerCase().includes(word)
      )
    );

    setFilteredProducts(results);
  }, [searchTerm, products]);

  // Add product to selectedProducts with a default selling amount of 1
  const addProductToSale = (product) => {
    // check and alert for ut of stock
    if (product.inStock <= 0) {
      Swal.fire(
        "Out of Stock",
        "This product is out of stock and cannot be added.",
        "warning"
      );
      return;
    }
    // console.log(product);
    const isAlreadySelected = selectedProducts.some(
      (selectedProduct) => selectedProduct._id === product._id
    );

    if (isAlreadySelected) {
      Swal.fire("Duplicate Entry", "This product is already added.", "warning");
    } else {
      setSelectedProducts((prev) => [
        ...prev,
        { ...product, sellingAmount: 1 },
      ]);
      setTotalPrice((prev) => prev + parseInt(product.productPrice));
      setTotalProfit(
        (prev) => prev + parseInt(product.productPrice - product.productCost)
      );
      // Remove from list after a selection
      setFilteredProducts((prev) =>
        prev.filter((item) => item._id !== product._id)
      );
    }
  };

  // Update selling amount and recalculate total price
  const handleSellingAmountChange = (index, value) => {
    let newValue = parseInt(value);
    if (isNaN(newValue) || newValue < 1) {
      newValue = 1; // Ensure minimum value is 1
    } else if (newValue > selectedProducts[index].inStock) {
      Swal.fire({
        icon: "warning",
        title: "⚠️ Invalid Input!",
        text: `You cannot enter more than ${selectedProducts[index].inStock} items in stock!`,
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
      newValue = selectedProducts[index].inStock; // Ensure it does not exceed inStock
    }
    const updatedProducts = [...selectedProducts];
    updatedProducts[index] = {
      ...updatedProducts[index],
      sellingAmount: newValue,
    };
    setSelectedProducts(updatedProducts);
    calculateTotalPrice(updatedProducts);
    calculateTotalProfit(updatedProducts);
  };

  // Update product price and recalculate total price
  const handlePriceChange = (index, value) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].productPrice = parseFloat(value);
    setSelectedProducts(updatedProducts);
    calculateTotalPrice(updatedProducts);
    calculateTotalProfit(updatedProducts);
  };

  // Calculate total price
  const calculateTotalPrice = (products) => {
    const newTotal = products.reduce(
      (sum, product) => sum + product.productPrice * product.sellingAmount,
      0
    );
    setTotalPrice(newTotal);
  };

  // Calculate total profit
  const calculateTotalProfit = (products) => {
    const newTotalProfit = products.reduce(
      (sum, product) =>
        sum +
        (product.productPrice - product.productCost) * product.sellingAmount,
      0
    );
    setTotalProfit(newTotalProfit);
  };

  // Submit submit (selected customer and products)
  const handleSubmitSale = async () => {
    // Show confirmation popup before submitting
    const result = await Swal.fire({
      title: "Confirm Sale Submission",
      text: "Are you sure you want to complete this sale?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, complete sale",
      cancelButtonText: "Cancel",
    });

    // If confirmed, proceed with the sale submission
    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        const response = await axiosPublic.post("/sale", {
          customer: selectedCustomer,
          products: selectedProducts,
        });
        setSearchTermCx("");
        setSearchTerm("");
        if (response.data) {
          Swal.fire("Success", "Sale completed successfully!", "success");
          refetch();
          setSelectedProducts([]);
          setSelectedCustomer([]);
          setTotalPrice(0);
          setTotalProfit(0);
          navigate("/dashboard/sales-list");
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire("Error", "Failed to complete sale.", "error");
      }
      setIsLoading(false);
    }
  };

  // Delete product item from selected list
  const handleDeleteSelectedProduct = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedProducts = selectedProducts.filter(
          (product) => product._id !== item._id
        );
        setSelectedProducts(updatedProducts);
        calculateTotalPrice(updatedProducts);
        calculateTotalProfit(updatedProducts);
        setFilteredProducts((prev) => [...prev, item]);
      }
    });
  };
  // Loader
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-2 mt-12">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500 border-solid"></div>
        <p className="text-blue-500 text-lg font-semibold">
          Sales is Executing...
        </p>
      </div>
    );
  }

  return (
    <div className="m-12">
      <SectionTitle
        subHeading="Search and sell your Products"
        heading="Sales"
      />
      {/* Search Customer and select */}
      <div className="bg-white p-6 rounded-lg shadow-md border mb-6 mt-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500">
          Search Customer
        </h2>
        {/* Search input field  */}
        <input
          type="text"
          placeholder="Search customer by name, address or mobile number"
          value={searchTermCx}
          onChange={(e) => setSearchTermCx(e.target.value)}
          className="input input-bordered w-full mb-4"
        />
        <ul className="space-y-2">
          {filteredCustomers.map((customer) => (
            <li
              key={customer._id}
              className="flex items-center bg-gray-100 px-2 py-1 rounded-md"
            >
              <button
                className="btn btn-sm btn-primary mr-4"
                onClick={() => {
                  setSelectedCustomer(customer);
                  setSearchTermCx("");
                }}
              >
                Add
              </button>
              <span>
                {customer.name} - {customer.mobile} - {customer.address}
              </span>
            </li>
          ))}
        </ul>
        {/* Selected Customer */}
        <div className="w-full p-4 bg-white rounded-lg overflow-auto">
          {selectedCustomer.length === 0 ? (
            <p className="text-red-500 italic text-center">
              No Customer is selected
            </p>
          ) : (
            <div className=" py-2 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-green-500">
                Customer Details
              </h3>
              <table className="min-w-full border rounded-lg">
                <tbody>
                  <tr className="hover:bg-gray-100 transition border">
                    <td className=" text-gray-800 font-medium px-4 py-2  w-1/3">
                      Name:
                    </td>
                    <td className="px-4 py-2 border-r w-2">:</td>
                    <td className="px-4 py-2">{selectedCustomer.name}</td>
                  </tr>
                  <tr className="hover:bg-gray-100 transition border">
                    <td className=" text-gray-800 font-medium px-4 py-2 ">
                      Mobile Number:
                    </td>
                    <td className="px-4 py-2 border-r w-2">:</td>
                    <td className="px-4 py-2">{selectedCustomer.mobile}</td>
                  </tr>
                  <tr className="hover:bg-gray-100 transition border">
                    <td className=" text-gray-800 font-medium px-4 py-2 ">
                      Address:
                    </td>
                    <td className="px-4 py-2 border-r w-2">:</td>
                    <td className="px-4 py-2">{selectedCustomer.address}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* Search product and select  */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Product Section  */}
        <div className="md:w-1/4 bg-white p-6 rounded-lg shadow-md border">
          <div className="text-2xl font-semibold mb-4 text-blue-500 flex justify-left items-center gap-1">
            <p className="text-xl">
              <FaSearchPlus />
            </p>
            <p className="text-xl">Products</p>
          </div>
          {/* Search input field  */}
          <input
            type="text"
            placeholder="Search product by brand or category"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full mb-4"
          />
          {/* Search Results  */}
          <ul className="space-y-2">
            {filteredProducts.map((product) => (
              <li
                key={product._id}
                className={`flex justify-between items-center p-4 rounded-md shadow transition-all relative
                ${
                  product.inStock === 0
                    ? "bg-gray-50 opacity-60 filter cursor-not-allowed"
                    : "bg-gray-100 hover:bg-gray-200 cursor-pointer"
                }`}
                onClick={() => product.inStock > 0 && addProductToSale(product)} // Prevent adding if out of stock
              >
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-500">
                      {product.brand}{" "}
                      <span className="text-sm text-gray-700">
                        ({product.subCategory})
                      </span>
                    </p>

                    <p className="text-sm bg-gray-200 px-1 rounded-lg">
                      {product.productPrice} Tk
                    </p>
                  </div>
                  <p className=" text-blue-600">
                    {product.category} <br />
                    <span className="text-green-600 font-semibold">
                      {product.subsubCategory}
                    </span>
                  </p>
                </div>
                {/* Show Out-of-Stock Icon */}
                {product.inStock === 0 && (
                  <FaTimesCircle
                    className="absolute top-2 right-2 text-red-600 text-xl"
                    title="Out of Stock"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
        {/* Selected products section  */}
        <div className="md:w-3/4 bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-2xl font-semibold mb-4 text-green-500">
            Selected Products
          </h2>
          {selectedProducts.length === 0 ? (
            <p className="text-red-500 italic text-center">
              No products selected
            </p>
          ) : (
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr>
                  <th className="border px-4 py-2 w-12">#</th>
                  <th className="border px-4 py-2 w-1/3">Product</th>
                  <th className="border px-4 py-2 w-24">Selling Price</th>
                  <th className="border px-4 py-2 w-16">In Stock</th>
                  <th className="border px-4 py-2 w-20">Selling Amt</th>
                  <th className="border px-4 py-2 w-24">Total(Selling)</th>
                  <th className="border px-4 py-2 w-24">Total(Profit)</th>
                  <th className="border px-4 py-2 w-16">Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product, index) => (
                  <tr key={index}>
                    {/* serial  */}
                    <td className="border px-4 py-2 text-center">
                      {index + 1}
                    </td>
                    {/* product name  */}
                    <td className="border px-4 py-2">
                      <div className="flex flex-col">
                        <p className="font-semibold text-gray-500">
                          {product.brand}{" "}
                          <span className="text-sm text-gray-700">
                            ({product.subCategory})
                          </span>
                        </p>
                        <p className="text-blue-600">
                          {product.category} <br />
                          <span className="text-green-600 font-semibold">
                            {product.subsubCategory}
                          </span>
                        </p>
                      </div>
                    </td>
                    {/* selling price  */}
                    <td className="border px-4 py-2">
                      <input
                        type="number"
                        value={product.productPrice}
                        onFocus={(e) => e.target.select()} // Select all text on focus
                        onChange={(e) =>
                          handlePriceChange(index, e.target.value)
                        }
                        onWheel={(e) => e.preventDefault()} // Prevent mouse wheel increment/decrement
                        className="input input-sm input-bordered w-20 text-right 
                                  [&::-webkit-inner-spin-button]:appearance-none 
                                  [&::-webkit-outer-spin-button]:appearance-none"
                      />
                    </td>
                    {/* inStock  */}
                    <td className="border px-4 py-2 text-center">
                      {product.inStock}
                    </td>
                    {/* selling amount  */}
                    <td className="border px-4 py-2">
                      <input
                        type="number"
                        min="1"
                        max={product.inStock}
                        value={product.sellingAmount}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleSellingAmountChange(
                            index,
                            parseInt(e.target.value)
                          )
                        }
                        className="input input-sm input-bordered max-w-16 text-right [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                    </td>
                    {/* Total Selling  */}
                    <td className="border px-4 py-2 text-right">
                      $
                      {(product.productPrice * product.sellingAmount).toFixed(
                        2
                      )}
                    </td>
                    {/* Total Profit  */}
                    <td className="border px-4 py-2 text-right">
                      $
                      {(
                        (product.productPrice - product.productCost) *
                        product.sellingAmount
                      ).toFixed(2)}
                    </td>
                    {/* action  */}
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => handleDeleteSelectedProduct(product)}
                        className="btn btn-ghost text-2xl text-red-500"
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {totalPrice > 0 && (
            <h2 className="text-xl font-bold mt-4">
              Total Price: ${totalPrice.toFixed(2)}
            </h2>
          )}
          {/* {totalProfit > 0 && (
            <h2 className="text-xl font-bold mt-4">
              Total Profit: ${totalProfit}
            </h2>
          )} */}
          {
            <h2 className="text-xl font-bold mt-4">
              Total Profit: ${totalProfit.toFixed(2)}
            </h2>
          }

          <button
            className="btn btn-primary mt-4"
            onClick={handleSubmitSale}
            disabled={
              selectedCustomer.length === 0 || selectedProducts.length === 0
            }
          >
            Complete Sale
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sales;
