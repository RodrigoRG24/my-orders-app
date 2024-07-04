import express from 'express';
import { createOrder, deleteOrder, getAllOrders, getOrder, updateOrder } from '../controllers/OrderController.js';

const router = express.Router()

router.get('/',getAllOrders)
router.get('/:id',getOrder)
router.post('/',createOrder)
router.put('/:id',updateOrder)
router.delete('/:id',deleteOrder)




export default router