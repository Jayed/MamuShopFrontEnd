import React, { useState, useEffect } from "react";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import LoaderSmall from "../../../Utils/LoaderSmall";
import { IoWarningOutline } from "react-icons/io5";

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
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <IoWarningOutline className="text-red-500 mr-2" />
          <span>Stock Alert Report</span>
        </h2>

        {loading ? (
          <p className="text-blue-500">
            <LoaderSmall />
          </p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : stockAlerts.length > 0 ? (
          <div className="overflow-y-auto" style={{ maxHeight: "380px" }}>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Product Name</th>
                  <th className="border p-2">Brand</th>
                  <th className="border p-2">In Stock</th>
                  <th className="border p-2">Stock Alert</th>
                  <th className="border p-2">Shortage</th>
                </tr>
              </thead>
              <tbody>
                {stockAlerts.map((product) => (
                  <tr key={product._id} className="text-left">
                    <td className="border p-2">
                      {product.category} |{" "}
                      <span className="text-blue-700">
                        {product.subCategory}
                      </span>{" "}
                      | {product.subsubCategory}
                    </td>
                    <td className="border p-2 text-center">{product.brand}</td>
                    <td className="border p-2 text-red-500 font-bold text-center">
                      {product.inStock}
                    </td>
                    <td className="border p-2 text-center">
                      {product.stockAlert}
                    </td>
                    <td className="border p-2 text-red-600 text-center">
                      {product.stockAlert - product.inStock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No stock alerts at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default StockAlert;
