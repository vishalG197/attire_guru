import { Routes, Route } from "react-router-dom";
import ProductPage from "../Pages/ProductPage";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import SignupCard from "../Pages/Signup";

import AddtocartPage from "../Pages/AddtocartPage";
import SingleProduct from "../Pages/SingleProductPage";


import { Payment } from "../Pages/Payment";
import { PriveteRoute } from "./PriveteRoute";
import About from "./About";
import Profile from "../Pages/Profile";
import MyOrders from "../Pages/MyOrders";
import OrderDetails from "../Pages/OrderDetails";

import AdminRoutes from "../Admin/Pages/AllRoutes";

export default function AllRoutes() {



   return <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/product" element={<ProductPage />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/aboutus" element={<About />} />


      <Route path="/product/:id" element={<SingleProduct />} />
      <Route path="/cart" element={<AddtocartPage />} />
      <Route path="/payment" element={<PriveteRoute> <Payment /></PriveteRoute>} />
      <Route path="/profile" element={<PriveteRoute> <Profile /></PriveteRoute>} />
      <Route path="/my-orders" element={<PriveteRoute> <MyOrders /></PriveteRoute>} />
      <Route path="/order-details/:id" element={<PriveteRoute> <OrderDetails /></PriveteRoute>} />

      <Route path="*" element={<h1>PageNotFound</h1>} />
      <Route path="/signup" element={<SignupCard />} />

   </Routes>
}