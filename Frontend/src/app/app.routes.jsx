import { createBrowserRouter } from "react-router";

import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "../features/products/pages/Dashboard";
import SellerHome from "../features/products/pages/SellerHome";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/Home";
import ProductDetails from "../features/products/pages/ProductDetails";
import SellerProuductEdit from "../features/products/pages/SellerProuductEdit";
import Cart from "../features/cart/pages/Cart";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
    path: "/products/:id",
    element: <ProductDetails />,
  },

  {
    path: "/cart",
    element: (
      
        <Cart />
      
    ),
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
        path: "edit/:id",
        element: (
          <Protected>
            <SellerProuductEdit />
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