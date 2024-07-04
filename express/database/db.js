import { Sequelize } from "sequelize";

const db = new Sequelize('orders_db','root','root',{
    host:'localhost',
    dialect:'mysql'

}) 

export default db