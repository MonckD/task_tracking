import dotenv from 'dotenv';
import express from 'express';
import { connectToDatabase } from './Config/config.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.send('Hello World!');
});

const connected = async () => {
    try {
        await connectToDatabase();
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

connected();