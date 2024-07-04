import db from "../database/db.js";
import { DataTypes } from "sequelize";

const ProductModel = db.define('products',{
    name:{type:DataTypes.STRING},
    unitPrice:{type:DataTypes.DECIMAL}
},{
    timestamps: false 
});

export default ProductModel