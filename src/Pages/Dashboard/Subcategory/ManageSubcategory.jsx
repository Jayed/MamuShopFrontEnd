import { Link } from "react-router-dom";
import SectionTitle from "../../../Components/SectionTitle/SectionTitle";
import useSubcategory from "../../../Hooks/useSubcategory";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import useCategories from "../../../Hooks/useCategories";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useState } from "react";

const ManageSubcategory = () => {
  const axiosPublic = useAxiosPublic();
  // Fetch categories using the custom hook
  const [subcategories, refetch, isPending] = useSubcategory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subcategory, setSubcategory] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  const [categories] = useCategories();

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
  // Sort subCategories by category name first, then by subcategory name
  const sortedSubCategories = [...subcategories].sort((a, b) => {
    const categoryComparison = a.categoryName.localeCompare(b.categoryName);
    if (categoryComparison !== 0) {
      return categoryComparison; // If categories are different, sort by category
    }
    return a.name.localeCompare(b.name); // If categories are the same, sort by subcategory name
  });
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
        const res = await axiosPublic.delete(`/subcategory/${item._id}`);
        if (res.data.deletedCount > 0) {
          refetch(); // Refetch to update the UI
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

  // ----+++ Add Category using modal +++----
  // Open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };
  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategoryName(""); // Reset the category input
    setSubcategory(""); // Reset the subcategory input
  };
  // Handle Create Subcategory
  const handleCreateSubcategory = async () => {
    // console.log("Form submitted Data: ", subcategory, selectedCategoryName);
    if (!subcategory.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Subcategory name is required!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    // Check for duplicate subcategory in the selected category
    const duplicate = subcategories.some(
      (item) =>
        item.name.toLowerCase() === subcategory.toLowerCase().trim() &&
        item.categoryName === selectedCategoryName
    );
    if (duplicate) {
      return Swal.fire({
        icon: "warning",
        title: `The subcategory "${subcategory}" already exists in "${selectedCategoryName}".`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
    // If no duplicate, proceed with the creation
    try {
      const response = await axiosPublic.post("/subcategory", {
        name: subcategory,
        categoryName: selectedCategoryName,
      });
      if (response.data.acknowledged) {
        refetch(); // Refetch to update the UI with the new category
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${subcategory} is added successfully!`,
          showConfirmButton: false,
          timer: 1500,
        });
        closeModal(); // Close modal after successful submission
      }
    } catch (error) {
      console.error("Error creating category:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to add Subcategory",
        text: error.message,
      });
    }
  };

  return (
    <div>
      {/* Section Title */}
      <div>
        <SectionTitle
          subHeading="Manage all Subcategories"
          heading="Subcategory"
        />
      </div>

      {/* Add Subcategory button with modal */}
      <div className="flex justify-start items-center ml-16">
        <button onClick={openModal} className="btn btn-primary my-2">
          Add Subcategory
        </button>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-216">
              {/* Modal Heading */}
              <h2 className="text-xl font-bold mb-4 text-center">
                Add Subcategory
              </h2>

              <div className="flex justify-center gap-4">
                {/* Subcategory Name Field */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Subcategory Name</span>
                  </label>
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)} // Update state on input change
                    className="input input-bordered w-full"
                    placeholder="Enter Subcategory name"
                  />
                </div>

                {/* Category option selection */}
                <div className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Category*</span>
                  </div>
                  <select
                    value={selectedCategoryName} // Bind the state to the select element
                    onChange={(e) => setSelectedCategoryName(e.target.value)} // Update the state on change
                    className="textarea textarea-bordered"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Create and Cancel Buttons */}
              <div className="flex justify-end gap-4 mt-16 mb-8">
                {/* Create  */}
                <button
                  onClick={handleCreateSubcategory}
                  className="btn btn-success"
                >
                  Create
                </button>
                {/* Cancel  */}
                <button onClick={closeModal} className="btn btn-outline">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Subcategory Manage Table */}
      <div className="mx-16 mt-8 mb-4">
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* Table Head */}
            <thead>
              <tr className="font-bold text-xl bg-gray-300">
                <th>#</th>
                <th>Subcategory</th>
                <th>Category</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {sortedSubCategories.map((item, index) => (
                <tr
                  key={item._id}
                  className={`${index % 2 === 0 ? "bg-blue-50" : "bg-gray-50"}`}
                >
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.categoryName}</td>
                  {/* Edit button  */}
                  <td>
                    <Link to={`/dashboard/update-subcategory/${item._id}`}>
                      <button className="btn btn-ghost text-2xl text-orange-500">
                        <FaEdit />
                      </button>
                    </Link>
                  </td>
                  {/* Delete button  */}
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

export default ManageSubcategory;
