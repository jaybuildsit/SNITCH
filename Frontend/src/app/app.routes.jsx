import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/createProduct";
import Dashboard from "../features/products/pages/Dashboard";
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
    path: "/seller/products/create",
    element: <CreateProduct />,
  },
  {
    path: "/seller",
    children: [
      {
        path: "/seller/create",
        element: <Protected>

          role="seller"

          <CreateProduct />
        </Protected>
      },
      {
        path: "/seller/dashboard",
        element: <Protected>

          role="seller"

          <Dashboard />
        </Protected>,
      },
    ]
  },



]);

