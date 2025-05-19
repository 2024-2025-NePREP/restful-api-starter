import dotenv from 'dotenv'

dotenv.config()

export const JWT_SECRET= process.env.JWT_SECRET as string
export const PORT= process.env.PORT as string
export const GMAIL_AUTH_EMAIL = process.env.GMAIL_SERVICE_AUTH_EMAIL;
export const GMAIL_AUTH_APP_WORD = process.env.GMAIL_SERVICE_AUTH_APP_PASSWORD;
export const CLIENT_URL=process.env.CLIENT_URL
export const ADMIN_EMAIL=process.env.ADMIN_EMAIL
export const ADMIN_PASSWORD=process.env.ADMIN_PASSWORD