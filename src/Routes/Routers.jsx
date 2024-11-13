import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../Pages/Home/Home/Home";
import Main from "../Layout/Main";
import Menu from "../Pages/Menu/Menu";
import Order from "../Pages/Order/Order";
import Login from "../Pages/Login/Login";
import SignUp from "../Pages/SignUp/SignUp";
import Secrete from "../Pages/Secrete/Secrete";
import PrivateRoutes from "./PrivateRoutes";
import Dashboard from "../Layout/Dashboard";
import AdminHome from "../Pages/Dashboard/AdminHome/AdminHome";
import AddProducts from "../Pages/Dashboard/Products/AddProducts";
import ManageProducts from "../Pages/Dashboard/Products/ManageProducts";
import AllUsers from "../Pages/Dashboard/AllUsers/AllUsers";
import Testing from "../Pages/Testing/Testing";
// import Categories from "../Pages/Dashboard/Categories/Categories";
// import UpdateCategory from "../Pages/Dashboard/Category/UpdateCategory"; No need, modal replaces
import ManageCategory from "../Pages/Dashboard/Category/ManageCategory";
import ManageSubcategory from "../Pages/Dashboard/Subcategory/ManageSubcategory";
import UpdateSubcategory from "../Pages/Dashboard/Subcategory/UpdateSubcategory";
import ManageSubsubCategory from "../Pages/Dashboard/SubsubCategory/ManageSubsubCategory";
import UpdateSubsubCategory from "../Pages/Dashboard/SubsubCategory/UpdateSubsubCategory";
import Sales from "../Pages/Dashboard/Sales/Sales";
import SalesList from "../Pages/Dashboard/Sales/SalesList";
import Customers from "../Pages/Dashboard/Customers/Customers";
import UpdateProducts from "../Pages/Dashboard/Products/UpdateProducts";

export const router = createBrowserRouter([
  {
    path: "",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/menu",
        element: <Menu />,
      },
      ,
      {
        path: "/order",
        element: <Order />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/testing",
        element: <Testing />,
      },
      {
        path: "/secrete",
        element: (
          <PrivateRoutes>
            <Secrete />
          </PrivateRoutes>
        ),
      },
    ],
  },
  {
    path: "dashboard",
    element: <Dashboard></Dashboard>,
    children: [
      {
        path: "admin-home",
        element: <AdminHome></AdminHome>,
      },
      {
        path: "add-products",
        element: <AddProducts></AddProducts>,
      },
      {
        path: "manage-products",
        element: <ManageProducts></ManageProducts>,
      },
      {
        path: "update-products/:id",
        element: <UpdateProducts />,
        loader: async ({ params }) => {
          const response = await fetch(
            `https://store-management-app-server.vercel.app/products/${params.id}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch the Products");
          }
          return response.json(); // Return the JSON data to the loader
        },
      },
      {
        path: "users",
        element: <AllUsers></AllUsers>,
      },

      {
        path: "manage-category",
        element: <ManageCategory></ManageCategory>,
      },
      {
        path: "manage-subcategory",
        element: <ManageSubcategory></ManageSubcategory>,
      },
      {
        path: "manage-subsubcategory",
        element: <ManageSubsubCategory></ManageSubsubCategory>,
      },
      // Update category, No need
      {
        // path: "update-category/:id",
        // element: <UpdateCategory />,
        // loader: async ({ params }) => {
        //   const response = await fetch(
        //     `https://store-management-app-server.vercel.app/category/${params.id}`
        //   );
        //   if (!response.ok) {
        //     throw new Error("Failed to fetch category");
        //   }
        //   return response.json(); // Return the JSON data to the loader
        // },
      },
      {
        path: "manage-subcategory",
        element: <ManageSubcategory></ManageSubcategory>,
      },
      {
        path: "update-subcategory/:id",
        element: <UpdateSubcategory />,
        loader: async ({ params }) => {
          const response = await fetch(
            `https://store-management-app-server.vercel.app/subcategory/${params.id}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch category");
          }
          return response.json(); // Return the JSON data to the loader
        },
      },
      {
        path: "manage-subsubcategory",
        element: <ManageSubsubCategory></ManageSubsubCategory>,
      },
      {
        path: "update-subsubcategory/:id",
        element: <UpdateSubsubCategory />,
        loader: async ({ params }) => {
          const response = await fetch(
            `https://store-management-app-server.vercel.app/subsubcategory/${params.id}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch category");
          }
          return response.json(); // Return the JSON data to the loader
        },
      },
      {
        path: "sales",
        element: <Sales></Sales>,
      },
      {
        path: "sales-list",
        element: <SalesList></SalesList>,
      },
      {
        path: "customers",
        element: <Customers></Customers>,
      },
    ],
  },
]);
