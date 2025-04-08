import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './infrastructure/database/connection';
import  userRoutes  from './interfaces/routes/userRoutes';
import { config } from './config/index';
import cookieParser from 'cookie-parser'

dotenv.config();
const PORT = config.port;
const app = express();

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));
app.use(express.json());
app.use('/api/users', userRoutes);



connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
