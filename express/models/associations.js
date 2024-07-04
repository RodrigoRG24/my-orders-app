import OrderModel from './OrderModel.js';
import ProductModel from './ProductModel.js';

OrderModel.belongsToMany(ProductModel, { through: 'order_products', foreignKey: 'orderId' });
ProductModel.belongsToMany(OrderModel, { through: 'order_products', foreignKey: 'productId' });
