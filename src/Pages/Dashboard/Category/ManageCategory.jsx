import Swal from "sweetalert2";
import useCategories from "../../../Hooks/useCategories";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import SectionTitle from "../../../Components/SectionTitle/SectionTitle";
import { useEffect, useState } from "react";

const ManageCategory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const axiosPublic = useAxiosPublic();

  // useEffect(() => {
  //   console.log("isModalOpen:", isModalOpen, "isEditMode:", isEditMode);
  // }, [isModalOpen, isEditMode]);

  // Fetch categories using the custom hook
  const [categories, refetch, isPending] = useCategories();
  // Loader
  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-2 mt-12">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500 border-solid"></div>
        <p className="text-blue-500 text-lg font-semibold">
          Loading sales data...
        </p>
      </div>
    );
  }
  // Sort categories alphabetically by name, ignoring case and trimming whitespace
  // const sortedCategories = [...categories].sort((a, b) =>
  //   a.name.trim().toLowerCase().localeCompare(b.name.trim().toLowerCase())
  // );

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
        const res = await axiosPublic.delete(`/category/${item._id}`);
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

  // ----+++ Add/Edit Category using modal +++----
  const openModal = (category = null) => {
    setIsEditMode(!!category); // Set to true if category is provided (edit mode), !! transform a variable into a true or false value
    setIsModalOpen(true);
    if (category) {
      setCategoryName(category.name); // Populate with existing category name
      setEditCategoryId(category._id);
    } else {
      setCategoryName(""); // Clear input for new category
      setEditCategoryId(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCategoryName("");
    setEditCategoryId(null);
  };

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Category name is required!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    // Check for duplicate category name
    const isDuplicate = categories.some(
      (category) =>
        category.name.toLowerCase() === categoryName.trim().toLowerCase()
    );
    if (isDuplicate) {
      return Swal.fire({
        icon: "error",
        title: "Duplicate Category",
        text: "This category name already exists!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    try {
      if (isEditMode) {
        // Edit existing category
        const response = await axiosPublic.patch(
          `/category/${editCategoryId}`,
          {
            name: categoryName,
          }
        );
        if (response.status === 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${categoryName} is updated successfully!`,
            showConfirmButton: false,
            timer: 1500,
          });
          refetch();
          closeModal();
        }
      } else {
        // Create new category
        const response = await axiosPublic.post("/category", {
          name: categoryName,
        });
        if (response.data.acknowledged) {
          refetch();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${categoryName} is added successfully!`,
            showConfirmButton: false,
            timer: 1500,
          });
          closeModal();
        }
      }
    } catch (error) {
      console.error("Error saving category:", error);
      Swal.fire({
        icon: "error",
        title: `Failed to ${isEditMode ? "update" : "add"} category`,
        text: error.message,
      });
    }
  };

  return (
    <div>
      {/* Section Title */}
      <div>
        <SectionTitle subHeading="Manage all categories" heading="Category" />
      </div>

      {/* Add Category Button */}
      <div className="flex justify-start items-center ml-16">
        <button onClick={() => openModal()} className="btn btn-primary my-2">
          Add Category
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-center">
              {isEditMode ? "Edit" : "Add"} Category
            </h2>

            {/* Category Name Field */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Category Name</span>
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Enter category name"
              />
            </div>

            {/* Save and Cancel Buttons */}
            <div className="flex justify-end gap-4">
              <button onClick={handleSaveCategory} className="btn btn-success">
                {isEditMode ? "Update" : "Create"}
              </button>
              <button onClick={closeModal} className="btn btn-outline">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Table */}
      <div className="mx-16 mt-8 mb-4">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="font-bold text-xl bg-gray-300">
                <th>#</th>
                <th>Category</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((item, index) => (
                <tr
                  key={item._id}
                  className={`${index % 2 === 0 ? "bg-blue-50" : "bg-gray-50"}`}
                >
                  <td>{index + 1}</td>
                  <td>{item.name}</td>

                  {/* Edit Category */}
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

export default ManageCategory;
