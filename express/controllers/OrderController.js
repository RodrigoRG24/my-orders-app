import OrderModel from "../models/OrderModel.js";
import ProductModel from "../models/ProductModel.js";
import OrderProduct from "../models/OrderProductModel.js";

export const getAllOrders = async (req,res) => {
    try {
        const orders = await OrderModel.findAll({
            include: [
                {
                    model: ProductModel,
                    through: {
                        attributes: ['productCount']
                    }
                }
            ]
        })
        res.json(orders)        
    } catch (error) {
        res.json({message:error.message})
    }
}

export const getOrder = async (req,res) => {
    try {
        const order = await OrderModel.findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: ProductModel,
                    through: {
                        attributes: ['productCount']
                    }
                }
            ]
        });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.json({message:error.message})
    }
}

export const createOrder = async (req,res) => {
    const { orderNumber, date, products } = req.body;
    try {
        const order = await OrderModel.create({ orderNumber, date });
        if (products && products.length > 0) {
            for (const item of products) {
                await OrderProduct.create({
                    orderId: order.id,
                    productId: item.productId,
                    productCount: item.productCount
                });
            }
        }
        res.status(201).json(order);
    } catch (error) {
        res.json({message:error.message})
    }
}

export const updateOrder = async (req, res) => {
    const { orderNumber, date, products } = req.body;
    const orderId = req.params.id;

    try {
        await OrderModel.update({ orderNumber, date }, { where: { id: orderId } });

        await OrderProduct.destroy({ where: { orderId } });

        if (products && products.length > 0) {
            for (const item of products) {
                await OrderProduct.create({
                    orderId,
                    productId: item.productId,
                    productCount: item.productCount
                });
            }
        }

        res.json({ message: "Order updated!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteOrder = async (req,res) => {
    try {
        await OrderModel.destroy({
            where:{id:req.params.id}
        })
        res.json({"message":"Order deleated!"})
    } catch (error) {
        res.json({message:error.message})
    }
}

