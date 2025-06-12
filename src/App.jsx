import React, { useState } from "react";
import ProductPage from "./ProductPage";
import DataDashboard from "./DataDashboard";
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('products');

  return (
    <div className="App">
      {/* Simple Navigation */}
      <div className="nav-bar">
        <button 
          onClick={() => setCurrentPage('products')}
          className={currentPage === 'products' ? 'active' : ''}
        >
           Products
        </button>
        <button 
          onClick={() => setCurrentPage('dashboard')}
          className={currentPage === 'dashboard' ? 'active' : ''}
        >
           Dashboard
        </button>
      </div>

      {/* Page Content */}
      {currentPage === 'products' ? <ProductPage /> : <DataDashboard />}
    </div>
  );
}

export default App;