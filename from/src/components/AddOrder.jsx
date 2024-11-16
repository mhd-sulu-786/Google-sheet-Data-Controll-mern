import React, { useState } from 'react';
import axios from 'axios';

const AddOrder = () => {
  const [order, setOrder] = useState({
    orderId: '',
    customerName: '',
    product: '',
    amount: '',
  });

  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/new-order', order);
      alert(response.data.message);
    } catch (error) {
      alert('Error adding order: ' + error.response?.data?.error || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Order</h2>
      <input type="text" name="orderId" placeholder="Order ID" onChange={handleChange} required />
      <input type="text" name="customerName" placeholder="Customer Name" onChange={handleChange} required />
      <input type="text" name="product" placeholder="Product" onChange={handleChange} required />
      <input type="number" name="amount" placeholder="Amount" onChange={handleChange} required />
      <button type="submit">Add Order</button>
    </form>
  );
};

export default AddOrder;
