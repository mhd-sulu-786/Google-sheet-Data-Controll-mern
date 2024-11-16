import React from 'react';
import AddOrder from './components/AddOrder';
import UpdateOrder from './components/UpdateOrder';
import FetchOrders from './components/FetchOrders.jsx';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <h1>Google Sheets API Example</h1>
      <AddOrder />
      <UpdateOrder />
      <FetchOrders />
      
    </div>
  );
};

export default App;
