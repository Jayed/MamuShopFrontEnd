import React, { useEffect, useState } from "react";
import axios from "axios";
import SectionTitle from "../../../Components/SectionTitle/SectionTitle";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { Link } from "react-router-dom";

const AdminHome = () => {
  const [totalInStock, setTotalInStock] = useState(0);
  const [totalStockValue, setTotalStockValue] = useState(0);
  const axiosPublic = useAxiosPublic();

  const fetchTotalInStock = async () => {
    try {
      const response = await axiosPublic.get("/total-instock");
      console.log(response);
      setTotalInStock(response.data.totalInStock);
    } catch (error) {
      console.error("Error fetching total inStock:", error);
    }
  };
  const fetchTotalStockValue = async () => {
    try {
      const response = await axiosPublic.get("/total-stock-value");
      console.log(response);
      setTotalStockValue(response.data.totalStockValue);
    } catch (error) {
      console.error("Error fetching total Stock Value:", error);
    }
  };

  useEffect(() => {
    fetchTotalInStock();
    fetchTotalStockValue();
  }, []);

  return (
    <div>
      {/* Section Title */}
      <div>
        <SectionTitle
          subHeading="All the summaries will be presented here"
          heading="Admin Home"
        />
      </div>
      <div className="mx-16 mt-8 mb-4">
        <div className="flex flex-wrap gap-4 justify-center md:justify-start mx-4 mt-8">
          {/* Total In-Stock */}
          <div className="flex-1 max-w-sm bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Total In-Stock
            </h2>
            <p className="text-3xl font-bold text-blue-600">{totalInStock}</p>
            <p className="text-sm text-gray-500 mt-2">
              Check the total amount of products currently in stock in your
              inventory.
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300">
              <Link to="/dashboard/manage-products">View Details</Link>
            </button>
          </div>
          {/* Total In-Stock Value */}
          <div className="flex-1 max-w-sm bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Total In-Stock Value
            </h2>
            <p className="text-3xl font-bold text-blue-600">
              {totalStockValue}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Check the total value of products currently in stock in your
              inventory.
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300">
              <Link to="/dashboard/manage-products">View Details</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
