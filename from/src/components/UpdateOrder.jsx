import React, { useState } from 'react';
import axios from 'axios';

const UpdateOrder = () => {
  const [updateData, setUpdateData] = useState({
    row: '',
    values: ['', '', '', ''], // Corresponds to columns A-D
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'row') {
      setUpdateData({ ...updateData, row: value });
    } else {
      const updatedValues = [...updateData.values];
      updatedValues[name] = value;
      setUpdateData({ ...updateData, values: updatedValues });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:5000/update-order', updateData);
      alert(response.data.message);
    } catch (error) {
      alert('Error updating order: ' + error.response?.data?.error || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Order</h2>
      <input type="number" name="row" placeholder="Row Number" onChange={handleChange} required />
      <input type="text" name="0" placeholder="Order ID" onChange={handleChange} />
      <input type="text" name="1" placeholder="Customer Name" onChange={handleChange} />
      <input type="text" name="2" placeholder="Product" onChange={handleChange} />
      <input type="number" name="3" placeholder="Amount" onChange={handleChange} />
      <button type="submit">Update Order</button>
    </form>
  );
};

export default UpdateOrder;
