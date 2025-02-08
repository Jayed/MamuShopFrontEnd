import React, { useState, useEffect } from "react";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import LoaderSmall from "../../../Utils/LoaderSmall";

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
      <div className="">
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-12 max-w-full mx-auto">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Sales Report
          </h2>
          <div className="flex gap-4">
            <div>
              <label className="text-sm text-gray-600">From:</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg p-2 mt-1"
              />
            </div>
            <div>
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
            className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300"
          >
            View Report
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {loading ? (
            <p className="text-blue-500 text-sm mt-4">
              <LoaderSmall></LoaderSmall>
            </p>
          ) : (
            totalSales !== null && (
              <>
                <p className="text-xl font-bold text-gray-800 mt-4">
                  Total Sales:{" "}
                  <span className="text-blue-600">${totalSales}</span>
                </p>
                <p className="text-xl font-bold text-gray-800 mt-4">
                  Total Profit:{" "}
                  <span className="text-blue-600">${totalProfit}</span>
                </p>
              </>
            )
          )}
        </div>
      </div>
  );
};

export default SalesReport;
