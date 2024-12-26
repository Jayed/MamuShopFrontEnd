import Swal from "sweetalert2";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import SectionTitle from "../../../Components/SectionTitle/SectionTitle";
import { useEffect, useState } from "react";
import useBrands from "../../../Hooks/useBrands";

const ManageBrand = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [editBrandId, setEditBrandId] = useState(null);
  const axiosPublic = useAxiosPublic();

  // Fetch brands using the custom hook
  const [brands, refetch, isPending] = useBrands();
  // Loader
  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-2 mt-12">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500 border-solid"></div>
        <p className="text-blue-500 text-lg font-semibold">
          Loading Brand data...
        </p>
      </div>
    );
  }
  // Handle Delete
  const handleDeleteItem = (item) => {
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
        const res = await axiosPublic.delete(`/brand/${item._id}`);
        if (res.data.deletedCount > 0) {
          refetch();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${item.name} is deleted successfully.`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    });
  };

  // ----+++ Add/Edit brand using modal +++----
  const openModal = (brand = null) => {
    setIsEditMode(!!brand); // Set to true if brand is provided (edit mode), !! transform a variable into a true or false value
    setIsModalOpen(true);
    if (brand) {
      setBrandName(brand.name); // Populate with existing brand name
      setEditBrandId(brand._id);
    } else {
      setBrandName(""); // Clear input for new brand
      setEditBrandId(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setBrandName("");
    setEditBrandId(null);
  };

  const handleSaveBrand = async () => {
    if (!brandName.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Brand name is required!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    // Check for duplicate brand name
    const isDuplicate = brands.some(
      (brand) => brand.name.toLowerCase() === brandName.trim().toLowerCase()
    );
    if (isDuplicate) {
      return Swal.fire({
        icon: "error",
        title: "Duplicate brand",
        text: "This brand name already exists!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    try {
      if (isEditMode) {
        // Edit existing brand
        const response = await axiosPublic.patch(`/brand/${editBrandId}`, {
          name: brandName,
        });
        if (response.status === 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${brandName} is updated successfully!`,
            showConfirmButton: false,
            timer: 1500,
          });
          refetch();
          closeModal();
        }
      } else {
        // Create new brand
        const response = await axiosPublic.post("/brand", {
          name: brandName,
        });
        if (response.data.acknowledged) {
          refetch();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${brandName} is added successfully!`,
            showConfirmButton: false,
            timer: 1500,
          });
          closeModal();
        }
      }
    } catch (error) {
      console.error("Error saving brand:", error);
      Swal.fire({
        icon: "error",
        title: `Failed to ${isEditMode ? "update" : "add"} brand`,
        text: error.message,
      });
    }
  };

  return (
    <div>
      {/* Section Title */}
      <div>
        <SectionTitle subHeading="Manage all Brands" heading="Brands" />
      </div>

      {/* Add Brand Button */}
      <div className="flex justify-start items-center ml-16">
        <button onClick={() => openModal()} className="btn btn-primary my-2">
          Add Brand
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-center">
              {isEditMode ? "Edit" : "Add"} brand
            </h2>

            {/* Brand Name Field */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Brand Name</span>
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Enter Brand name"
              />
            </div>

            {/* Save and Cancel Buttons */}
            <div className="flex justify-end gap-4">
              <button onClick={handleSaveBrand} className="btn btn-success">
                {isEditMode ? "Update" : "Create"}
              </button>
              <button onClick={closeModal} className="btn btn-outline">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Brand Table */}
      <div className="mx-16 mt-8 mb-4">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="font-bold text-xl bg-gray-300">
                <th>#</th>
                <th>Brand</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((item, index) => (
                <tr
                  key={item._id}
                  className={`${index % 2 === 0 ? "bg-blue-50" : "bg-gray-50"}`}
                >
                  <td>{index + 1}</td>
                  <td>{item.name}</td>

                  {/* Edit brand */}
                  <td>
                    <button
                      onClick={() => openModal(item)}
                      className="btn btn-ghost text-2xl text-orange-500"
                    >
                      <FaEdit />
                    </button>
                  </td>

                  {/* Delete */}
                  <td>
                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="btn btn-ghost text-2xl text-red-500"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageBrand;
