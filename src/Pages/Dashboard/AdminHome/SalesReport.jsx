import React, { useState, useEffect } from "react";
import LoaderSmall from "../../../Utils/LoaderSmall";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { TbReportSearch } from "react-icons/tb";
import { DollarSign } from "lucide-react";

const SalesReport = () => {
  const axiosPublic = useAxiosPublic();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [totalSales, setTotalSales] = useState(null);
  const [totalProfit, setTotalProfit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const getLast7Days = () => {
  //   const today = new Date();
  //   const last7Days = new Date();
  //   last7Days.setDate(today.getDate() - 7);
  //   return {
  //     from: last7Days.toISOString().split("T")[0],
  //     to: today.toISOString().split("T")[0],
  //   };
  // };
  const getTodays = () => {
    const todayEnd = new Date();
    const todayStart = new Date();
    todayStart.setDate(todayEnd.getDate() - 0);
    return {
      from: todayStart.toISOString().split("T")[0],
      to: todayEnd.toISOString().split("T")[0],
    };
  };

  const fetchSalesReport = async (start, end) => {
    try {
      setLoading(true);
      setError("");
      const response = await axiosPublic.get(
        `/sales-report?startDate=${start}&endDate=${end}`
      );
      setTotalSales(response.data.totalSales);
      setTotalProfit(response.data.totalProfit);
    } catch (error) {
      setError("Error fetching sales report. Try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { from, to } = getTodays();
    setFromDate(from);
    setToDate(to);
    fetchSalesReport(from, to);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TbReportSearch className="text-blue-500 text-2xl" />
          <span className="text-lg font-semibold">Sales Reports</span>
        </div>
        <div className="flex flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="text-sm text-gray-600">From:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg p-2 mt-1"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm text-gray-600">To:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg p-2 mt-1"
            />
          </div>
        </div>
        <button
          onClick={() => fetchSalesReport(fromDate, toDate)}
          className="w-auto px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300 mb-4"
        >
          View Report
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {loading ? (
          <p className="text-blue-500 text-sm mt-4">
            <LoaderSmall />
          </p>
        ) : (
          totalSales !== null && (
            <div className="flex flex-wrap gap-6 justify-start mt-2">
              {/* Total Sales Box */}
              <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-lg px-6 py-2 w-60 md:w-72">
                <div className="p-2 bg-blue-100 rounded-full">
                  <DollarSign className="text-blue-600 w-8 h-8" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm text-gray-500">Total Sales</h2>
                  <p className="text-xl font-bold text-gray-800">
                    ৳{totalSales}
                  </p>
                </div>
              </div>

              {/* Total Profit Box */}
              <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-lg px-6 py-2 w-60 md:w-72">
                <div className="p-2 bg-green-100 rounded-full">
                  <DollarSign className="text-green-600 w-8 h-8" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm text-gray-500">Total Profit</h2>
                  <p className="text-xl font-bold text-gray-800">
                    ৳{totalProfit}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SalesReport;
