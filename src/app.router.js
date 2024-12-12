import connectDB from '../db/connection.js';
import categoriesRouter from './modules/category/category.router.js'
import programRouter from './modules/program/program.router.js'
import authRouter from './modules/auth/auth.router.js'
import userRouter from './modules/user/user.router.js'
import reviewRouter from './modules/review/review.router.js'
import companyRouter from './modules/company/company.router.js'


import cors from 'cors'
const initApp = (app,express) => {
    connectDB();
    // Allow specific origins
const allowedOrigins = [
    'http://localhost:5173', // For local development
    'https://skillup-front.onrender.com', // Deployed frontend
  ];
  
  const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Include cookies or authorization headers
  };
  
  app.use(cors(corsOptions));
    
    app.use(express.json());
    app.get('/', (req,res)=>{
        return res.status(200).json({massage:"success"})
    })

    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/categories', categoriesRouter)
    app.use('/programs', programRouter)
    app.use('/reviews', reviewRouter)
    app.use('/companies', companyRouter)


    
    app.use('*', (req,res) =>{
        return res.status(404).json({massage: "page not found"});
    })
}

export default initApp;