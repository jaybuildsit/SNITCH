import { createBrowserRouter } from "react-router";

import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "../features/products/pages/Dashboard";
import SellerHome from "../features/products/pages/SellerHome";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/Home";
import ProductDetails from "../features/products/pages/ProductDetails";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home /> ,
  },

  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path:"/products/:id",
    element: <ProductDetails />,
  },

  {
    path: "/seller",
    children: [
      {
        index: true,
        element: (
          <Protected>
            <SellerHome />
          </Protected>
        ),
      },

      {
        path: "create",
        element: (
          <Protected>
            <CreateProduct />
          </Protected>
        ),
      },

      {
        path: "dashboard",
        element: (
          <Protected>
            <Dashboard />
          </Protected>
        ),
      },
    ],
  },
]);