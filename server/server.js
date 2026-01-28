import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js'
import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import creditRouter from './routes/creditRoutes.js'
import { stripeWebhooks } from './controllers/webhooks.js'

const app = express()

await connectDB()

// Stripe Webhooks
app.post('/api/stripe', express.raw({type: 'application/json'}), stripeWebhooks)

// Middleware
// CORS configuration for development and production
const corsOptions = {
  origin: [
    'http://localhost:5173',  // Vite dev server default port
    'http://localhost:3000',  // Fallback
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL,  // Production frontend URL
    'https://quickgpt-4j5q.onrender.com', // Add your actual Render frontend URL
    /\.onrender\.com$/, // Allow all Render subdomains
    /\.vercel\.app$/    // Allow all Vercel subdomains
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions))
app.use(express.json())

// Routes
app.get('/', (req, res)=> res.send('Server is Live!'))
app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)
app.use('/api/credit', creditRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})