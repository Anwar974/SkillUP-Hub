import connectDB from '../db/connection.js';
import categoriesRouter from './modules/category/category.router.js'
import trainingRouter from './modules/training/training.router.js'
import authRouter from './modules/auth/auth.router.js'
import userRouter from './modules/user/user.router.js'

import cors from 'cors'
const initApp = (app,express) => {
    connectDB();
    app.use(cors());
    app.use(express.json());
    app.get('/', (req,res)=>{
        return res.status(200).json({massage:"success"})
    })

    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/categories', categoriesRouter)
    app.use('/trainings', trainingRouter)
    
    app.use('*', (req,res) =>{
        return res.status(404).json({massage: "page not found"});
    })
}

export default initApp;