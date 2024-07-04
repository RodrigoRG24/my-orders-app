import db from "../database/db.js";
import { DataTypes } from "sequelize";


const OrderModel = db.define('orders',{
    orderNumber:{type:DataTypes.STRING},
    date:{type:DataTypes.DATE},
    status: { type: DataTypes.ENUM('Pending', 'InProgress', 'Completed'), defaultValue: 'Pending' },
},{
    timestamps: false 
});

export default OrderModel