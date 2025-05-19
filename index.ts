import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv'
import { PORT } from './constants/envVars';
import { authRouter } from './routes/auth';
import cors from 'cors'
import { userRouter } from './routes/user';
import cookieParser from 'cookie-parser'
import { vehicleRouter } from './routes/vehicle';
import { parkingSlotRouter } from './routes/parkingSlot';

dotenv.config()

const app: Express = express()

app.use(cors({
  origin: "http://localhost:3000"
  ,  credentials: true //Allows cookies to be senty
}))

app.use(express.json({ limit: '2mb' }));
// Parse the cookies in res and req
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)  
app.use('/api/vehicle', vehicleRouter)
app.use('/api/parking_slot', parkingSlotRouter)

app.get('/api', (req: Request, res: Response) => {
  res.send("Home page")
})
app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
})