import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv'
import { PORT } from './constants/envVars';
import { authRouter } from './routes/auth';
import cors from 'cors'
import { userRouter } from './routes/user';
import cookieParser from 'cookie-parser'
import { vehicleRouter } from './routes/vehicle';
import { parkingSlotRouter } from './routes/parkingSlot';
import { reservationRouter } from './routes/slotReservation';
import { seedAdminUser } from './seeders/admin';
import { error } from 'console';
import { adminMiddleware } from './middlewares/adminMiddleware';

dotenv.config()

const app: Express = express()

app.use(cors({
  origin: "http://localhost:3000"
  ,  credentials: true //Allows cookies to be senty
}))

app.use(express.json());
// Parse the cookies in res and req
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)  
app.use('/api/vehicle',adminMiddleware, vehicleRouter)
app.use('/api/parking_slot', parkingSlotRouter)
app.use('/api/slot_reservation', reservationRouter)

app.get('/api', (req: Request, res: Response) => {
  res.send("Home page")
})

seedAdminUser()
.then(() => {
  app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
  })
})
.catch((error) =>{
  console.error('Failed to seed admin ', error.message)
  process.exit(1)
})