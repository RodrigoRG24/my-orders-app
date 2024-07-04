import express from "express"
import cors from "cors"

import db from "./database/db.js"
import './models/associations.js';
import orderRouters from "./routes/orderRoutes.js"
import productRouters from "./routes/productRoutes.js"

const app = express()

app.use(cors())
app.use(express.json())
app.use('/orders',orderRouters)
app.use('/products',productRouters)

const startServer = async () => {
    try {
        await db.authenticate();
        console.log('Conexion exitosa a la BD');
        
        // Sincronizar los modelos con la base de datos
        await db.sync({ alter: true });
        console.log('Base de datos sincronizada');

        // Iniciar el servidor después de la sincronización
        app.listen(8000, () => {
            console.log('Server is up on http://localhost:8000/');
        });
    } catch (error) {
        console.log(`El error de conexión es ${error}`);
    }
};

startServer();