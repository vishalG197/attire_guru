import React from 'react'

import { Routes, Route } from "react-router-dom";
import DashBoard from './DashBoard';
import AllProducts from './AllProducts';
import Shirts from './Shirts';
import Kurtas from './Kurtas';
import DressMaterial from './DressMaterial';
import Sarees from './Sarees';
import Jeans from './Jeans';
import Shoes from './Shoes';
import Sandals from './Sandals';
import Login from './Login';
import Users from './Users';
import Orders from './Orders';
import EditProduct from '../Components/EditProduct';
import AddProduct from './AddProduct';
import PrivateRoute from './PrivateRoute';
import AdminLayout from '../Components/AdminLayout';
import UserDetail from './UserDetail';
import OrderDetail from './OrderDetail';

const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path='Login' element={<Login />} />
        <Route path='edit/:id' element={<PrivateRoute><AdminLayout><EditProduct /></AdminLayout></PrivateRoute>} />
        <Route path='Users' element={<PrivateRoute><AdminLayout><Users /></AdminLayout></PrivateRoute>} />
        <Route path='Orders' element={<PrivateRoute><AdminLayout><Orders /></AdminLayout></PrivateRoute>} />
        <Route path='Dashboard' element={<PrivateRoute><AdminLayout><DashBoard /></AdminLayout></PrivateRoute>} />
        <Route path='AllProducts' element={<PrivateRoute><AdminLayout><AllProducts /></AdminLayout></PrivateRoute>} />
        <Route path='Shirts' element={<PrivateRoute><AdminLayout><Shirts /></AdminLayout></PrivateRoute>} />
        <Route path='Kurtas' element={<PrivateRoute><AdminLayout><Kurtas /></AdminLayout></PrivateRoute>} />
        <Route path='Dress-Material' element={<PrivateRoute><AdminLayout><DressMaterial /></AdminLayout></PrivateRoute>} />
        <Route path='Sarees' element={<PrivateRoute><AdminLayout><Sarees /></AdminLayout></PrivateRoute>} />
        <Route path='Jeans' element={<PrivateRoute><AdminLayout><Jeans /></AdminLayout></PrivateRoute>} />
        <Route path='Shoes' element={<PrivateRoute><AdminLayout><Shoes /></AdminLayout></PrivateRoute>} />
        <Route path='Sandals' element={<PrivateRoute><AdminLayout><Sandals /></AdminLayout></PrivateRoute>} />
        <Route path='AddProduct' element={<PrivateRoute><AdminLayout><AddProduct /></AdminLayout></PrivateRoute>} />
        <Route path='user/:id' element={<PrivateRoute><AdminLayout><UserDetail /></AdminLayout></PrivateRoute>} />
        <Route path='order/:id' element={<PrivateRoute><AdminLayout><OrderDetail /></AdminLayout></PrivateRoute>} />


      </Routes>
    </div>
  )
}

export default AllRoutes