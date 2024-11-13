import React, { useState, useEffect } from "react";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import SectionTitle from "../../../Components/SectionTitle/SectionTitle";
import Swal from "sweetalert2";
import Pagination from "../../../Components/Pagination/Pagination";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTermCx, setSearchTermCx] = useState(""); // Cx - Customer
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const axiosPublic = useAxiosPublic();

  // Pagination state
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;

  // Fetch customers
  useEffect(() => {
    fetchCustomers();
  }, []);
  // Get all customers
  const fetchCustomers = async () => {
    const { data } = await axiosPublic.get("/customers");
    // console.log(data);
    setCustomers(data);
    setPageCount(Math.ceil(data?.length / itemsPerPage));
    setCurrentItems(data?.slice(0, itemsPerPage));
  };

  // Handle pagination click
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % customers.length;
    setItemOffset(newOffset);
    setCurrentItems(customers.slice(newOffset, newOffset + itemsPerPage));
  };

  // Filtered customer based on searchTerm change
  useEffect(() => {
    if (searchTermCx.trim() === "") {
      // Set filteredCustomers to an empty array if searchTerm is empty
      setFilteredCustomers([]);
      return;
    }

    const searchWords = searchTermCx.toLowerCase().split(" ");
    const results = customers.filter((customer) =>
      searchWords.every(
        (word) =>
          customer.name?.toLowerCase().includes(word) ||
          customer.mobile?.toLowerCase().includes(word) ||
          customer.address?.toLowerCase().includes(word)
      )
    );

    setFilteredCustomers(results);
  }, [searchTermCx, customers]);

  // form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const customerData = { name, mobile, address }; // as name, mobile, and address are in state

    // Show confirmation dialog before submission
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save these changes?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (editingCustomer) {
            // Edit existing customer
            await axiosPublic.put(
              `/customers/${editingCustomer._id}`,
              customerData
            );

            // Show success message after editing
            Swal.fire({
              icon: "success",
              title: "Customer Updated",
              text: "The customer's information has been updated successfully.",
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            // Add new customer
            await axiosPublic.post("/customers", customerData);

            // Show success message after adding
            Swal.fire({
              icon: "success",
              title: "Customer Added",
              text: "The new customer has been added successfully.",
              showConfirmButton: false,
              timer: 1500,
            });
          }

          // Clear the form fields and edit state
          setName("");
          setMobile("");
          setAddress("");
          setEditingCustomer(null);

          // Refresh the customer list after a successful operation
          fetchCustomers();
        } catch (error) {
          console.error("Error submitting customer data:", error);
          Swal.fire({
            icon: "error",
            title: "Operation Failed",
            text: "Something went wrong while saving the customer data. Please try again.",
          });
        }
      }
    });
  };
  // Edit
  const handleEdit = (customer) => {
    Swal.fire({
      title: "Edit Customer",
      text: "Are you sure you want to edit this customer's information?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, edit",
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed, proceed with setting up the edit state
        setName(customer.name);
        setMobile(customer.mobile);
        setAddress(customer.address);
        setEditingCustomer(customer);

        // Show success message (optional)
        Swal.fire({
          icon: "success",
          title: "Edit Mode Activated",
          text: "You can now update the customer's details.",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };
  // Delete
  const handleDelete = async (id) => {
    // Show confirmation dialog
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
          // Proceed with deletion if confirmed
          await axiosPublic.delete(`/customers/${id}`);
          fetchCustomers(); // Refresh the customer list after deletion

          // Show success message
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The customer has been deleted.",
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (error) {
          console.error("Error deleting customer:", error);
          // Show error message if something went wrong
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong while deleting the customer!",
          });
        }
      }
    });
  };
  return (
    <div>
      <SectionTitle
        subHeading="Create new customer or Edit an existing customer."
        heading="CREATE & EDIT CUSTOMER"
      />
      {/* Edit or Create customer form  */}
      <div className="max-w-lg mx-auto p-4 bg-base-100 shadow-lg rounded-lg mb-6">
        <h2 className="text-2xl font-bold text-center text-primary mb-4">
          Customer Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full"
            required
          />
          <input
            type="text"
            placeholder="Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="input input-bordered w-full"
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input input-bordered w-full"
            required
          />

          <button type="submit" className="btn btn-primary w-full">
            {editingCustomer ? "Update" : "Add"} Customer
          </button>
        </form>
      </div>
      {/* Search Customer and Take action */}
      <div className="max-w-lg mx-auto p-4 bg-base-100 shadow-lg rounded-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-500">
          Search Customer
        </h2>
        {/* Search input field  */}
        <input
          type="text"
          placeholder="Search customer by name, address or mobile number"
          value={searchTermCx}
          onChange={(e) => setSearchTermCx(e.target.value)}
          className="input input-bordered w-full mb-4"
        />
        <div>
          {searchTermCx && filteredCustomers.length === 0 ? (
            <div>
              <p className="text-red-500 italic text-center">
                No Customer is Found
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {(searchTermCx ? filteredCustomers : currentItems).map(
                (customer) => (
                  <li
                    key={customer._id}
                    className="flex items-center justify-between p-4 bg-base-200 rounded-lg shadow-sm"
                  >
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.mobile}</p>
                      <p className="text-sm text-gray-500">
                        {customer.address}
                      </p>
                    </div>

                    <div className="space-x-2">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="btn btn-sm btn-outline btn-primary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(customer._id)}
                        className="btn btn-sm btn-outline btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                )
              )}
            </ul>
          )}
        </div>
        {/* Use the Pagination component */}
        <Pagination pageCount={pageCount} onPageChange={handlePageClick} />
      </div>
    </div>
  );
};

export default Customers;
