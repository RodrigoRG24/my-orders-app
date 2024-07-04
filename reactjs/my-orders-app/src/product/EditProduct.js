import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Grid, TextField, Button } from '@mui/material';

const EditProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);
    const [name, setName] = useState('');
    const [unitPrice, setunitPrice] = useState('');

    useEffect(() => {
        if (isEdit) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/products/${id}`);
            const { name, unitPrice } = response.data;
            setName(name);
            setunitPrice(unitPrice);
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productData = { name, unitPrice };
        try {
            if (isEdit) {
                await axios.put(`http://localhost:8000/products/${id}`, productData);
            } else {
                await axios.post('http://localhost:8000/products', productData);
            }
            navigate('/my-products'); // Redirect to product list after saving
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>{isEdit ? 'Edit Product' : 'Add Product'}</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            type="number"
                            label="unitPrice"
                            value={unitPrice}
                            onChange={(e) => setunitPrice(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary">
                            Save {isEdit ? 'Changes' : 'Product'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default EditProduct;
