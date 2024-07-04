import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Button, MenuItem, Select } from '@mui/material';

const TableOrder = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8000/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/orders/${id}`);
            fetchOrders(); 
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    const getTotalProductCount = (products) => {
        return products.reduce((total, product) => total + product.order_products.productCount, 0);
    };

    const getFinalPrice = (products) => {
        return products.reduce((total, product) => total + (parseFloat(product.unitPrice) * product.order_products.productCount), 0).toFixed(2);
    };


    return (
        <Container>
            <Typography variant="h4" gutterBottom>Orders</Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Order Number</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Product Count</TableCell>
                            <TableCell>Final Price</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Options</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map(order => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.orderNumber}</TableCell>
                                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                <TableCell>{getTotalProductCount(order.products)}</TableCell>
                                <TableCell>${getFinalPrice(order.products)}</TableCell>
                                <TableCell>
                                    <Select>
                                        <MenuItem value="Pending">Pending</MenuItem>
                                        <MenuItem value="InProgress">InProgress</MenuItem>
                                        <MenuItem value="Completed">Completed</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Button component={Link} to={`/edit-order/${order.id}`} variant="outlined" color="primary">
                                        Edit
                                    </Button>
                                    <Button variant="outlined" color="secondary" onClick={() => handleDelete(order.id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <Button component={Link} to="/edit-order" variant="contained" color="primary" style={{ marginTop: '20px' }}>
                    Create Order
                </Button>
                <Button component={Link} to="/my-products" variant="contained" color="primary" style={{ marginLeft: '10px' }}>
                    Products
                </Button>
            </div>
        </Container>
    );
};

export default TableOrder;
