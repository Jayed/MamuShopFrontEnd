import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, DollarSign, Users, FileText } from "lucide-react";
import LoaderSmall from "../../../Utils/LoaderSmall";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

const Summary = () => {
  const [totalInStock, setTotalInStock] = useState(0);
  const [totalStockValue, setTotalStockValue] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Loader state
  const axiosPublic = useAxiosPublic();

  const fetchData = async () => {
    try {
      const [inStockRes, stockValueRes, customersRes, invoicesRes] =
        await Promise.all([
          axiosPublic.get("/total-instock"),
          axiosPublic.get("/total-stock-value"),
          axiosPublic.get("/total-customers"),
          axiosPublic.get("/total-invoices"),
        ]);

      setTotalInStock(inStockRes.data.totalInStock);
      setTotalStockValue(Math.round(stockValueRes.data.totalStockValue));
      setTotalCustomers(customersRes.data.totalCustomers);
      setTotalInvoices(invoicesRes.data.totalInvoices);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false); // Hide loader after fetching
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className=" flex flex-wrap gap-6 justify-center md:justify-start">
      {/* Total In-Stock */}
      <div className="flex flex-1 items-center justify-between bg-white border border-gray-200 rounded-lg shadow-md p-6">
        <Package className="text-blue-600 w-12 h-12" />
        <div className="ml-4">
          <h2 className="text-sm text-gray-500">Total In-Stock</h2>
          {isLoading ? (
            <LoaderSmall></LoaderSmall>
          ) : (
            <p className="text-3xl font-bold text-gray-800">{totalInStock}</p>
          )}
          <Link
            to="/dashboard/manage-products"
            className="text-blue-500 text-sm mt-2 inline-block"
          >
            View Details →
          </Link>
        </div>
      </div>

      {/* Total Stock Value */}
      <div className="flex flex-1 items-center justify-between bg-white border border-gray-200 rounded-lg shadow-md p-6">
        <DollarSign className="text-green-600 w-12 h-12" />
        <div className="ml-4">
          <h2 className="text-sm text-gray-500">Total Stock Value</h2>
          {isLoading ? (
            <LoaderSmall></LoaderSmall>
          ) : (
            <p className="text-3xl font-bold text-gray-800">
              {totalStockValue}
            </p>
          )}
          <Link
            to="/dashboard/manage-products"
            className="text-blue-500 text-sm mt-2 inline-block"
          >
            View Details →
          </Link>
        </div>
      </div>
      {/* Total customers */}
      <div className="flex flex-1 items-center justify-between bg-white border border-gray-200 rounded-lg shadow-md p-6">
        <Users className="text-green-600 w-12 h-12" />
        <div className="ml-4">
          <h2 className="text-sm text-gray-500"># Customers</h2>
          {isLoading ? (
            <LoaderSmall></LoaderSmall>
          ) : (
            <p className="text-3xl font-bold text-gray-800">{totalCustomers}</p>
          )}
          <Link
            to="/dashboard/customers"
            className="text-blue-500 text-sm mt-2 inline-block"
          >
            View Details →
          </Link>
        </div>
      </div>
      {/* Total Stock Value */}
      <div className="flex flex-1 items-center justify-between bg-white border border-gray-200 rounded-lg shadow-md p-6">
        <FileText className="text-green-600 w-12 h-12" />
        <div className="ml-4">
          <h2 className="text-sm text-gray-500"># Invoices</h2>
          {isLoading ? (
            <LoaderSmall></LoaderSmall>
          ) : (
            <p className="text-3xl font-bold text-gray-800">{totalInvoices}</p>
          )}
          <Link
            to="/dashboard/sales-list"
            className="text-blue-500 text-sm mt-2 inline-block"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Summary;
