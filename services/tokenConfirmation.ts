import { PrismaClient } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../exceptions/errors"
import { isValidUUID } from "../utils/checkUUIDString"

const prisma = new PrismaClient()
   export const 
   createConfirmToken= async(token: string, userId: string)=> {
      
            // Check if userId is valid UUID
            isValidUUID(userId)
            
            // Create a new confirmation token
            const confirmToken = await prisma.confirmationToken.create({
                data: {
                    token,
                    userId,
                }
            })

            return confirmToken

     
    }
    
export const findOneByUserId = async(userId: string) => {
        
            // Check if token exists and return it
            const token = await prisma.confirmationToken.findFirst({where:{userId}})
            if (!token) throw new NotFoundError("Confirmation token not found");
            
            // Return the token
            return token
        
    }


   export  const deleteToken = async(userId: string) => {
        
            // Check if token exists
            const token = await prisma.confirmationToken.findMany({where: {userId}})
            if (token.length === 0) return;

            // Now delete the token
            await prisma.confirmationToken.deleteMany({where:{userId}})
            
            // Return true or false for the deletion
            return "Deleted all successfully"
       
    }

