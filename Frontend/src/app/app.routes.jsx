import { createBrowserRouter } from "react-router";

import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "../features/products/pages/Dashboard";
import SellerHome from "../features/products/pages/SellerHome";
import Protected from "../features/auth/components/Protected";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <h1>HelloWorld</h1>,
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