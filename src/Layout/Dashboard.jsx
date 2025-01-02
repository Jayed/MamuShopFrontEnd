import { NavLink, Outlet } from "react-router-dom";
import { FaHome, FaList, FaUsers, FaPlusSquare, FaBars } from "react-icons/fa";
import { useState } from "react";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // console.log("isSidebarOpen", isSidebarOpen);

  return (
    <div className="flex min-h-screen relative">
      {/* Toggle Button for small screens, hidden when sidebar is open */}
      {!isSidebarOpen && (
        <button
          className="md:hidden p-4 text-blue-600 fixed top-4 left-4 z-20"
          onClick={toggleSidebar}
        >
          <FaBars className="text-2xl" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-blue-50 pt-8 pl-4 z-30 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:translate-x-0`}
      >
        <ul className="menu space-y-2 w-60">
          <li>
            <NavLink to="/dashboard/admin-home" onClick={() => setIsSidebarOpen(false)}>
              <FaHome className="mr-2" /> Admin Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/manage-category"
              onClick={() => setIsSidebarOpen(false)}
            >
              <FaList className="mr-2" /> Manage Category
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/manage-subcategory"
              onClick={() => setIsSidebarOpen(false)}
            >
              <FaList className="mr-2" /> Manage Subcategory
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/manage-subsubcategory"
              onClick={() => setIsSidebarOpen(false)}
            >
              <FaList className="mr-2" /> Manage Sub-subcategory
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/manage-brand"
              onClick={() => setIsSidebarOpen(false)}
            >
              <FaList className="mr-2" /> Manage Brand
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/add-products"
              onClick={() => setIsSidebarOpen(false)}
            >
              <FaPlusSquare className="mr-2" /> Add Products
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/manage-products"
              onClick={() => setIsSidebarOpen(false)}
            >
              <FaList className="mr-2" /> Manage Products
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/sales"
              onClick={() => setIsSidebarOpen(false)}
            >
              <FaList className="mr-2" /> Create Sales
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/sales-list"
              onClick={() => setIsSidebarOpen(false)}
            >
              <FaList className="mr-2" /> Sales List
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/customers"
              onClick={() => setIsSidebarOpen(false)}
            >
              <FaUsers className="mr-2" /> Customers
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/users"
              onClick={() => setIsSidebarOpen(false)}
            >
              <FaUsers className="mr-2" /> All Users
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Overlay for Sidebar (only visible when sidebar is open) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
