import { DataTypes } from 'sequelize';
import db from '../database/db.js';
import OrderModel from './OrderModel.js';
import ProductModel from './ProductModel.js';

const OrderProduct = db.define('order_products', {
    orderId: {
        type: DataTypes.INTEGER,
        references: {
            model: OrderModel,
            key: 'id'
        },
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: ProductModel,
            key: 'id'
        },
        allowNull: false
    },
    productCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

OrderModel.belongsToMany(ProductModel, { through: OrderProduct, foreignKey: 'orderId' });
ProductModel.belongsToMany(OrderModel, { through: OrderProduct, foreignKey: 'productId' });

export default OrderProduct;
