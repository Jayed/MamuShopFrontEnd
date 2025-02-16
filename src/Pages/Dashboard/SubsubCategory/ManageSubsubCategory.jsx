import React, { useState } from "react";
import SectionTitle from "../../../Components/SectionTitle/SectionTitle";
import useSubcategory from "../../../Hooks/useSubcategory";
import useSubsubCategory from "../../../Hooks/useSubsubCategory";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useEffect } from "react";

const ManageSubsubCategory = () => {
  const [subcategories] = useSubcategory();
  const [subsubcategories, refetch, isPending] = useSubsubCategory();
  const axiosPublic = useAxiosPublic();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subsubcategory, setSubsubcategory] = useState("");
  const [selectedSubcategoryName, setSelectedSubcategoryName] = useState("");
  // For search
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

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

  // Handle Delete
  const handleDeleteItem = (item) => {
    // console.log("Item: ", item);
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
        const res = await axiosPublic.delete(`/subsubcategory/${item._id}`);
        // console.log(res);
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
    setSelectedSubcategoryName(""); // Reset the category input
    setSubsubcategory(""); // Reset the subcategory input
  };
  // Handle Create Subcategory
  const handleCreateSubsubcategory = async () => {
    // console.log(
    //   "Form submitted Data: ",
    //   subsubcategory,
    //   selectedSubcategoryName
    // );
    if (!subsubcategory.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Subcategory name is required!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    // Check for duplicates
    const isDuplicate = subsubcategories.some(
      (item) =>
        item.name === subsubcategory &&
        item.subcategoryName === selectedSubcategoryName
    );

    if (isDuplicate) {
      return Swal.fire({
        icon: "warning",
        title: "Sub-subcategory already exists!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    try {
      const response = await axiosPublic.post("/subsubcategory", {
        name: subsubcategory,
        subcategoryName: selectedSubcategoryName,
      });
      if (response.data.acknowledged) {
        refetch(); // Refetch to update the UI with the new category
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${subsubcategory} is added successfully!`,
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
  // Filtered Items based on searchTerm change
  useEffect(() => {
    if (searchTerm.trim() === "") {
      // Set filteredItems to an empty array if searchTerm is empty
      setFilteredItems([]);
      return;
    }

    const searchWords = searchTerm.toLowerCase().split(" ");
    const results = subsubcategories.filter((item) =>
      searchWords.every(
        (word) =>
          item.name?.toLowerCase().includes(word) ||
          item.subcategoryName?.toLowerCase().includes(word)
      )
    );

    setFilteredItems(results);
  }, [searchTerm, subsubcategories]);

  return (
    <div>
      {/* Section Title */}
      <div>
        <SectionTitle
          subHeading="Manage all Sub Subcategories"
          heading="Sub Subcategory"
        />
      </div>

      {/* Add Sub Subcategory button with modal */}
      <div className="flex justify-normal gap-4 items-center mx-16 mt-4">
        <button onClick={openModal} className="btn btn-primary my-2">
          Add Sub Subcategory
        </button>
        <input
          type="text"
          placeholder="Search by subcategory or sub-subcategory"
          className="input input-bordered w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-216">
              {/* Modal Heading */}
              <h2 className="text-xl font-bold mb-4 text-center">
                Add Sub-subcategory
              </h2>

              <div className="flex justify-center gap-4">
                {/* Sub-subcategory Name Field */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Sub-subcategory Name</span>
                  </label>
                  <input
                    type="text"
                    value={subsubcategory}
                    onChange={(e) => setSubsubcategory(e.target.value)} // Update state on input change
                    className="input input-bordered w-full"
                    placeholder="Enter Subcategory name"
                  />
                </div>

                {/* Subcategory option selection  */}
                <div className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Subcategory*</span>
                  </div>
                  <select
                    value={selectedSubcategoryName} // Bind the state to the select element
                    onChange={(e) => setSelectedSubcategoryName(e.target.value)} // Update the state on change
                    className="textarea textarea-bordered"
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories.map((subcategory) => (
                      <option key={subcategory._id} value={subcategory.name}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Create and Cancel Buttons */}
              <div className="flex justify-end gap-4 mt-16 mb-8">
                {/* Create  */}
                <button
                  onClick={handleCreateSubsubcategory}
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

      {/* Sub Subcategory Manage Table */}
      <div className="mx-16 mt-8 mb-4">
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* Table Head */}
            <thead>
              <tr className="font-bold text-xl bg-gray-300">
                <th>#</th>
                <th>Sub Subcategory</th>
                <th>Subcategory</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {(searchTerm ? filteredItems : subsubcategories).map(
                (item, index) => (
                  <tr
                    key={item._id}
                    className={`${
                      index % 2 === 0 ? "bg-blue-50" : "bg-gray-50"
                    }`}
                  >
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.subcategoryName}</td>
                    {/* Edit button  */}
                    <td>
                      <Link to={`/dashboard/update-subsubcategory/${item._id}`}>
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
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageSubsubCategory;
