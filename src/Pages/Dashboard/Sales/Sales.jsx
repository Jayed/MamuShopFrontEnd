import React, { useState, useEffect } from "react";
import useProducts from "../../../Hooks/useProducts";
import SectionTitle from "../../../Components/SectionTitle/SectionTitle";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { MdDelete } from "react-icons/md";
import { FaSearchPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import useCustomers from "../../../Hooks/useCustomers";
import { useNavigate } from "react-router-dom";

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
  const axiosPublic = useAxiosPublic();
  // Fetch customer
  const [customers] = useCustomers();
  const [isLoading, setIsLoading] = useState(false);

  // Helper functions
  console.log("selectedCustomer:", selectedCustomer);
  console.log("selectedProducts:", selectedProducts);

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
          product.subCategory?.toLowerCase().includes(word) ||
          product.subsubCategory?.toLowerCase().includes(word)
      )
    );

    setFilteredProducts(results);
  }, [searchTerm, products]);

  // Add product to selectedProducts with a default selling amount of 1
  const addProductToSale = (product) => {
    // console.log(product);
    const isAlreadySelected = selectedProducts.some(
      (selectedProduct) => selectedProduct._id === product._id
    );

    if (isAlreadySelected) {
      alert("This product is already added.");
    } else {
      setSelectedProducts((prev) => [
        ...prev,
        { ...product, sellingAmount: 1 },
      ]);
      setTotalPrice((prev) => prev + parseInt(product.productPrice));
      // Remove from list after a selection
      setFilteredProducts((prev) =>
        prev.filter((item) => item._id !== product._id)
      );
    }
  };

  // Update selling amount and recalculate total price
  const handleSellingAmountChange = (index, value) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].sellingAmount = parseInt(value);
    setSelectedProducts(updatedProducts);
    calculateTotalPrice(updatedProducts);
  };

  // Update product price and recalculate total price
  const handlePriceChange = (index, value) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].productPrice = parseFloat(value);
    setSelectedProducts(updatedProducts);
    calculateTotalPrice(updatedProducts);
  };

  // Calculate total price
  const calculateTotalPrice = (products) => {
    const newTotal = products.reduce(
      (sum, product) => sum + product.productPrice * product.sellingAmount,
      0
    );
    setTotalPrice(newTotal);
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
              className="flex items-center bg-gray-100 p-2 rounded-md"
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
                {customer.name} - {customer.mobile} - ${customer.address}
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
          {/* <h3 className="text-xl font-medium mb-2">Search Results:</h3> */}
          <ul className="space-y-2">
            {filteredProducts.map((product) => (
              <li
                key={product._id}
                className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
              >
                <span>
                  {product.subCategory} - {product.subsubCategory} - $
                  {product.productPrice}
                </span>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => addProductToSale(product)}
                >
                  Add
                </button>
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
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="border px-4 py-2">#</th>
                  <th className="border px-4 py-2">Product</th>
                  <th className="border px-4 py-2">Price</th>
                  <th className="border px-4 py-2">inStock</th>
                  <th className="border px-4 py-2">Selling</th>
                  <th className="border px-4 py-2">Total</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">
                      {product.subCategory} - {product.subsubCategory}
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="number"
                        min="100"
                        value={product.productPrice}
                        onFocus={(e) => e.target.select()} //onclick select all text
                        onChange={(e) =>
                          handlePriceChange(index, e.target.value)
                        }
                        className="input input-sm input-bordered w-24"
                      />
                    </td>
                    <td className="border px-4 py-2">{product.inStock}</td>
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
                        className="input input-sm input-bordered w-16"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      ${product.productPrice * product.sellingAmount}
                    </td>
                    <td className="border px-4 py-2">
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
              Total Price: ${totalPrice}
            </h2>
          )}

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
