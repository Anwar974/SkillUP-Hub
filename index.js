import 'dotenv/config'
import express from 'express'
import initApp from './src/app.router.js';
import connectDB from './db/connection.js';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = ["http://localhost:5173","https://skillup-front.onrender.com"];
app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,POST,PUT,DELETE,HEAD,PATCH',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // Set to true if you're passing cookies or authorization headers
    preflightContinue: false
    
  }));
initApp(app,express);



connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`server is running ...... ${PORT}`);
    })
 }).catch(err =>{
   console.log("fail while connecting to server"+ err);
 })