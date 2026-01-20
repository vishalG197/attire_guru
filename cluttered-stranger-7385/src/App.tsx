import React from 'react';
import './App.css';
import Navbar from './component/Navbar';
import Footer from './component/Footer';
import AllRoutes from "./component/AllRoutes"
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {!isAdminRoute && <Navbar />}
      <AllRoutes />
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
