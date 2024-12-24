import categoriesRouter from './modules/category/category.router.js'
import programRouter from './modules/program/program.router.js'
import authRouter from './modules/auth/auth.router.js'
import userRouter from './modules/user/user.router.js'
import reviewRouter from './modules/review/review.router.js'
import companyRouter from './modules/company/company.router.js'
import cors from 'cors'


const initApp = (app,express) => {
    app.use(express.json());
// const allowedOrigins = ["http://localhost:5173","http://localhost:5174", "https://admindashboard-8bwy.onrender.com"];
// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//   },
//   methods: 'GET,POST,PUT,DELETE,HEAD,PATCH',
//   allowedHeaders: 'Content-Type, Authorization',
//   credentials: true, 
//   preflightContinue: false
// }));

const corsOptions = {
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://skillup-front.onrender.com"
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true
  };

    app.use(cors(corsOptions));
    app.options('*', cors(corsOptions));
        
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