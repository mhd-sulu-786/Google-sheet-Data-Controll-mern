import React, { useState } from 'react';
import axios from 'axios';

const FetchOrders = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/get-orders');
            setOrders(response.data.data);
        } catch (error) {
            alert('Error fetching orders: ' + error.response?.data?.error || error.message);
        }
    };

    const deleteOrder = async (row) => {
        try {
            // Pass row number in the request body
            await axios.delete('http://localhost:5000/delete-order', {
                data: { row },
            });
    
            // Update the orders state after deletion
            setOrders(orders.filter((_, index) => index + 1 !== row));
        } catch (error) {
            alert('Error deleting order: ' + (error.response?.data?.error || error.message));
        }
    };
    

    return (
        <div>
            <h2>Fetch Orders</h2>
            <button onClick={fetchOrders}>Fetch Orders</button>
            {orders.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer Name</th>
                            <th>Product</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={index}>
                                {order.map((cell, idx) => (
                                    <td key={idx}>{cell}</td>
                                ))}
                                <td>
                                    <button onClick={() => deleteOrder(index + 1)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            )}
        </div>
    );
};

export default FetchOrders;
