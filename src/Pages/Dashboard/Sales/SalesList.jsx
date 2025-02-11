import React, { useEffect, useState } from "react";

import { FaEye } from "react-icons/fa";
import InvoicePDF from "../../../Utils/InvoicePDF";
import { pdf } from "@react-pdf/renderer";
import { MdDelete } from "react-icons/md";
// import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import SectionTitle from "../../../Components/SectionTitle/SectionTitle";
import { useForm } from "react-hook-form";
import Loader from "../../../Utils/Loader";
import Pagination from "../../../Components/Pagination/Pagination";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";


const SalesList = () => {
  const [salesData, setSalesData] = useState([]);
  const [specSalesProduct, setSpecSalesProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosPublic = useAxiosPublic();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [iframeSrc, setIframeSrc] = useState(null); // New state for iframe src
  // Pagination state
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 8;

  // Fetch sales records data
  const fetchSalesData = async () => {
    try {
      setIsLoading(true);
      const response = await axiosPublic.get("/sales-list");

      // Sort the sales data by date in descending order (latest date first)
      const sortedSalesData = response.data.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });

      setSalesData(sortedSalesData);
      setIsLoading(false);
      setPageCount(Math.ceil(response?.data?.length / itemsPerPage));
      setCurrentItems(response?.data?.slice(0, itemsPerPage));
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };
  // Handle pagination click
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % salesData?.length;
    setItemOffset(newOffset);
    setCurrentItems(salesData?.slice(newOffset, newOffset + itemsPerPage));
  };

  useEffect(() => {
    fetchSalesData();
  }, []);
  // console.log(salesData);

  // Get specific sales record
  const GetSpecSalesProduct = async (id) => {
    try {
      const response = await axiosPublic.get(`/sales-list/${id}`);
      const products = response.data[0]?.products || []; // Ensure it's an array
      // setSpecSalesProduct(products); // Set it directly to the products array
      console.log(products);
      return products; // Return the products array for further use
    } catch (error) {
      console.error("Error fetching sales record:", error);
      return []; // Return an empty array on error
    }
  };

  // handleViewPDF
  const handleViewPDF = async (id) => {
    try {
      const response = await axiosPublic.get(`/sales-list/${id}`);
      const { customer, products, totalAmount, invoiceNumber, date } =
        response.data[0];
      await handlePreviewPDF(
        customer,
        products,
        totalAmount,
        invoiceNumber,
        date
      );
    } catch (error) {
      console.error("Error fetching sales record:", error);
    }
  };

  // handlePreviewPDF
  const handlePreviewPDF = async (
    customer,
    selectedProducts,
    totalPrice,
    invoiceNumber,
    date
  ) => {
    // console.log(
    //   "Selected customer, Products, Total Price and others for PDF:",
    //   customer,
    //   selectedProducts,
    //   totalPrice,
    //   invoiceNumber,
    //   date
    // );
    const blob = await pdf(
      <InvoicePDF
        selectedCustomer={customer}
        selectedProducts={selectedProducts}
        totalPrice={totalPrice}
        invoiceNumber={invoiceNumber}
        date={date}
      />
    ).toBlob();

    setPdfBlob(blob);
    setIsModalOpen(true);
  };

  useEffect(() => {
    // Update iframe src when pdfBlob changes
    if (pdfBlob) {
      setIframeSrc(URL.createObjectURL(pdfBlob));
    }
  }, [pdfBlob]);

  const handleDownloadPDF = () => {
    if (!pdfBlob) return;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(pdfBlob);
    link.download = "sales_invoice.pdf";
    link.click();
    URL.revokeObjectURL(link.href);
  };
  // Delete Sale
  const handleDeleteSale = async (id) => {
    // Fetch specSalesProduct and wait for it to complete
    const fetchedSpecSalesProduct = await GetSpecSalesProduct(id);
    // Show confirmation modal
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
        try {
          const res = await axiosPublic.delete(`/sales/${id}`, {
            data: { specSalesProduct: fetchedSpecSalesProduct }, // Use the fetched data
          });
          if (res?.data?.result?.deletedCount > 0) {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "The sale was deleted successfully.",
              showConfirmButton: false,
              timer: 1500,
            });
            fetchSalesData();
          }
        } catch (error) {
          console.error("Error deleting sale:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        }
      }
    });
  };

  return (
    <>
      <SectionTitle
        subHeading="Provide all information about the new product"
        heading="ADDING NEW PRODUCT"
      />
      <div className="m-8 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">
          Sales List
        </h2>

        {isLoading ? (
          // Loader
          <Loader></Loader>
        ) : error ? (
          <p className="text-red-500 font-bold text-3xl ">Error: {error}</p>
        ) : (
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="border px-4 py-2">Invoice</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Customer</th>
                <th className="border px-4 py-2">Sells</th>
                <th className="border px-4 py-2">Profit</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((sale) => (
                <tr key={sale._id}>
                  <td className="border px-4 py-2">{sale.invoiceNumber}</td>
                  <td className="border px-4 py-2">
                    {new Date(sale.date).toLocaleDateString("en-CA")}
                  </td>
                  <td className="border px-4 py-2">
                    {sale.customer?.name ? sale.customer.name : "NF"}
                  </td>
                  <td className="border px-4 py-2">
                    <span className="font-extrabold text-xs mr-1">৳</span>
                    {sale.totalAmount}
                  </td>
                  <td className="border px-4 py-2">
                    <span className="font-extrabold text-xs mr-1">৳</span>
                    {(sale.totalProfit ?? 0).toFixed(2)}
                  </td>
                  {/* Action buttons  */}
                  <td className="flex justify-center border px-4 py-2">
                    <button
                      onClick={() => handleViewPDF(sale._id)}
                      className="btn btn-ghost text-2xl text-green-500"
                    >
                      <FaEye />
                    </button>
                    {/* <button
                    //onClick={() => handleEditSale(sale._id)}
                    className="btn btn-ghost text-xl text-yellow-500"
                  >
                    <FaEdit />
                  </button> */}
                    <button
                      onClick={() => handleDeleteSale(sale._id)}
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
        {/* Use the Pagination component */}
        <Pagination pageCount={pageCount} onPageChange={handlePageClick} />

        {/* Modal */}
        {isModalOpen && (
          <div className="modal modal-open modal-bottom sm:modal-middle">
            <div className="modal-box w-full h-full">
              <iframe
                src={URL.createObjectURL(pdfBlob)}
                title="PDF Preview"
                width="100%"
                height="85%"
              ></iframe>
              <div className="modal-action">
                <button className="btn btn-accent" onClick={handleDownloadPDF}>
                  Download
                </button>
                <button
                  className="btn btn-error"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SalesList;
