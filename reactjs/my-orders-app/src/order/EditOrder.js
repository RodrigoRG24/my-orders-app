import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Container, Typography, Grid, TextField, Button,
    Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Modal, Select, MenuItem
} from '@mui/material';

const EditOrder = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);
    const [order, setOrder] = useState({ products: [] });
    const [orderNumber, setOrderNumber] = useState('');
    const [date, setDate] = useState('');
    const [productCount, setProductCount] = useState(0);
    const [finalPrice, setFinalPrice] = useState(0);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [productQty, setProductQty] = useState(1);
    const [addModalOpen, setAddModalOpen] = useState(false); 
    const [editModalOpen, setEditModalOpen] = useState(false); 
    const [editProductId, setEditProductId] = useState(null);

    useEffect(() => {
        if (isEdit) {
            fetchOrder();
        } else {
            setDate(new Date().toISOString().split('T')[0]);
        }
        fetchProducts();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/orders/${id}`);
            const { orderNumber, date, products } = response.data;
            setOrder(response.data);
            setOrderNumber(orderNumber);
            setDate(new Date(date).toISOString().split('T')[0]);
            setProductCount(calculateProductCount(products));
            setFinalPrice(calculateFinalPrice(products));
        } catch (error) {
            console.error('Error fetching order:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/products'); 
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const calculateProductCount = (products) => {
        return products.reduce((total, product) => total + product.order_products.productCount, 0);
    };

    const calculateFinalPrice = (products) => {
        return products.reduce((total, product) => total + (parseFloat(product.unitPrice) * product.order_products.productCount), 0).toFixed(2);
    };

    const handleAddProduct = () => {
        const existingProduct = order.products.find(p => p.id === selectedProduct);
        if (existingProduct) {
            const updatedProduct = {
                ...existingProduct,
                order_products: {
                    productCount: existingProduct.order_products.productCount + parseInt(productQty)
                }
            };
            const updatedProducts = order.products.map(p => p.id === selectedProduct ? updatedProduct : p);
            setOrder(prev => ({
                ...prev,
                products: updatedProducts
            }));
        } else {
            const product = products.find(p => p.id === selectedProduct);
            const newProduct = {
                ...product,
                order_products: {
                    productCount: productQty
                }
            };
            setOrder(prev => ({
                ...prev,
                products: [...prev.products, newProduct]
            }));
        }
        setProductCount(calculateProductCount(order.products));
        setFinalPrice(calculateFinalPrice(order.products));
        setAddModalOpen(false);
        setSelectedProduct('');
        setProductQty(1);
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product.id);
        setProductQty(product.order_products.productCount);
        setEditProductId(product.id);
        setEditModalOpen(true);
    };

    const handleSaveChanges = () => {
        const updatedProducts = order.products.map(product => {
            if (product.id === editProductId) {
                return {
                    ...product,
                    order_products: {
                        productCount: parseInt(productQty)
                    }
                };
            }
            return product;
        });
        setOrder(prev => ({
            ...prev,
            products: updatedProducts
        }));
        setProductCount(calculateProductCount(updatedProducts));
        setFinalPrice(calculateFinalPrice(updatedProducts));
        setEditModalOpen(false); 
        setSelectedProduct('');
        setProductQty(1);
        setEditProductId(null);
    };

    const handleDeleteProduct = (productId) => {
        const updatedProducts = order.products.filter(product => product.id !== productId);
        setOrder(prev => ({ ...prev, products: updatedProducts }));
        setProductCount(calculateProductCount(updatedProducts));
        setFinalPrice(calculateFinalPrice(updatedProducts));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const orderData = {
                orderNumber,
                date,
                products: order.products.map(product => ({
                    productId: product.id,
                    productCount: product.order_products.productCount
                }))
            };
            if (isEdit) {
                await axios.put(`http://localhost:8000/orders/${id}`, orderData);
            } else {
                await axios.post('http://localhost:8000/orders', orderData);
            }
            navigate('/my-orders'); 
        } catch (error) {
            console.error('Error saving order:', error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>{isEdit ? 'Edit Order' : 'Add Order'}</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Order Number"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            type="date"
                            label="Date"
                            value={date}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            type="number"
                            label="Product Count"
                            value={productCount}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Final Price"
                            value={finalPrice}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="outlined" color="primary" onClick={() => setAddModalOpen(true)}>
                            Add Product
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Unit Price</TableCell>
                                        <TableCell>Qty</TableCell>
                                        <TableCell>Total Price</TableCell>
                                        <TableCell>Options</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {order.products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>{product.id}</TableCell>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>${product.unitPrice}</TableCell>
                                            <TableCell>{product.order_products.productCount}</TableCell>
                                            <TableCell>${(product.unitPrice * product.order_products.productCount).toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Button variant="outlined" color="primary" onClick={() => handleEditProduct(product)}>
                                                    Edit
                                                </Button>
                                                <Button variant="outlined" color="secondary" onClick={() => handleDeleteProduct(product.id)}>
                                                    Remove
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary">
                            Save {isEdit ? 'Changes' : 'Order'}
                        </Button>
                    </Grid>
                </Grid>
            </form>

            
            <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)}>
                <Container style={{ padding: '20px', background: 'white', marginTop: '10%' }}>
                    <Typography variant="h6" gutterBottom>Add Product</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Select
                                required
                                fullWidth
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                            >
                                {products.map(product => (
                                    <MenuItem key={product.id} value={product.id}>
                                        {product.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                type="number"
                                label="Quantity"
                                value={productQty}
                                onChange={(e) => setProductQty(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={handleAddProduct}>
                                Add to Order
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </Modal>

            
            <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
                <Container style={{ padding: '20px', background: 'white', marginTop: '10%' }}>
                    <Typography variant="h6" gutterBottom>Edit Product</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Select
                                required
                                fullWidth
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                                disabled
                            >
                                {products.map(product => (
                                    <MenuItem key={product.id} value={product.id}>
                                        {product.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                type="number"
                                label="Quantity"
                                value={productQty}
                                onChange={(e) => setProductQty(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                                Save Changes
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </Modal>
        </Container>
    );
};

export default EditOrder;
