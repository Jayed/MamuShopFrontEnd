import React, { useState, useEffect } from "react";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const StockAlert = () => {
  const axiosPublic = useAxiosPublic();
  const [stockAlerts, setStockAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch stock alert products
  const fetchStockAlerts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosPublic.get("/stock-alert");
      setStockAlerts(response.data);
    } catch (err) {
      setError("Failed to fetch stock alerts.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockAlerts();
  }, []);

  return (
    <div className="">
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-12 max-w-full mx-auto">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Stock Alert Report
        </h2>

        {loading ? (
          <p className="text-blue-500">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : stockAlerts.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Product Code</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Brand</th>
                <th className="border p-2">In Stock</th>
                <th className="border p-2">Stock Alert</th>
                <th className="border p-2">Shortage</th>
              </tr>
            </thead>
            <tbody>
              {stockAlerts.map((product) => (
                <tr key={product._id} className="text-center">
                  <td className="border p-2">{product.productCode}</td>
                  <td className="border p-2">{product.category}</td>
                  <td className="border p-2">{product.brand}</td>
                  <td className="border p-2 text-red-500 font-bold">
                    {product.inStock}
                  </td>
                  <td className="border p-2">{product.stockAlert}</td>
                  <td className="border p-2 text-red-600 font-bold">
                    {product.stockAlert - product.inStock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No stock alerts at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default StockAlert;
