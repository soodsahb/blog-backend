import dotenv from 'dotenv'
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';


const app = express();
dotenv.config()

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));  
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://simple-blog-q1mg0hlr1-pranavs-projects-bdba995f.vercel.app'
    : 'http://localhost:3000'
}));


app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Blog API' });
  });

await connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});