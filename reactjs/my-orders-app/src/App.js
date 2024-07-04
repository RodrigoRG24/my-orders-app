import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TableOrder from './order/TableOrder.js'; 
import EditOrder from './order/EditOrder.js';
import TableProduct from './product/TableProduct.js';
import EditProduct from './product/EditProduct.js';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/my-orders" element={<TableOrder />} />
        <Route path="/edit-order/:id?" element={<EditOrder />} />
        <Route path="/my-products" element={<TableProduct />} />
        <Route path="/edit-product/:id?" element={<EditProduct />} /> 
        <Route path="/" element={<TableOrder />} />  
      </Routes>
    </Router>
  );
};

export default App;

