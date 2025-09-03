import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import schoolsRouter from './routes/schools.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());


app.use('/api/schools', schoolsRouter);

const port = process.env.PORT ;
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
