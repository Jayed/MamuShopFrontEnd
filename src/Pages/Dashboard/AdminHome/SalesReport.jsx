import React, { useState, useEffect } from "react";
import LoaderSmall from "../../../Utils/LoaderSmall";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { TbReportSearch } from "react-icons/tb";

const SalesReport = () => {
  const axiosPublic = useAxiosPublic();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [totalSales, setTotalSales] = useState(null);
  const [totalProfit, setTotalProfit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getLast7Days = () => {
    const today = new Date();
    const last7Days = new Date();
    last7Days.setDate(today.getDate() - 7);
    return {
      from: last7Days.toISOString().split("T")[0],
      to: today.toISOString().split("T")[0],
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
    const { from, to } = getLast7Days();
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
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
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
          className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300 mb-4"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white border border-gray-200 rounded-lg shadow p-4">
                <p className="text-xl font-bold text-gray-800">
                  Total Sales:{" "}
                  <span className="text-blue-600">${totalSales}</span>
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg shadow p-4">
                <p className="text-xl font-bold text-gray-800">
                  Total Profit:{" "}
                  <span className="text-blue-600">${totalProfit}</span>
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SalesReport;
