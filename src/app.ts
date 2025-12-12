import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import AuthRoutes from '@/routes/auth.routes.js';
import ScoresRoutes from '@/routes/scores.routes.js'

const app = express();
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
    origin: [
        'https://btc-v9k8.onrender.com',
        'http://localhost:5173',
        'https://localhost:5173',
    ]
}));
app.use(cookieParser());
app.use(express.json());


app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/scores', ScoresRoutes);

export default app;