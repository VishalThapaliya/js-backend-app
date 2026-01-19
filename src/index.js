import dotenv from 'dotenv';
import connectDB from "./db/dbConnection.js";
import { app } from './app.js';

const port = process.env.PORT || 8080;
dotenv.config({
    path: './env'
});

connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`Server is running at port ${port}`);
    })
})
.catch((err) => console.log('MongoDB connection error: ', err));