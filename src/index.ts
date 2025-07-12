import express, { ErrorRequestHandler, Handler, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './utils/db.js';
import { userRoutes } from './routes/userRoute.js';
import { ErrorHandlingMiddlewareFunction } from 'mongoose';
dotenv.config();

connectDB();
const app = express();

const corsOptions = {
    origin: ['http://localhost:5173','https://e-book-client-zeta.vercel.app'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  };
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


const PORT = process.env.PORT || 3001

app.use('/api/user',userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const ge  = (err:Error, req:Request,res:Response,next: NextFunction)=>{
  console.log(err.cause);
}
app.use(ge)