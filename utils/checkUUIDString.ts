import { BadRequestError } from "../exceptions/errors";

export const isValidUUID = (id: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const match=  uuidRegex.test(id);

    if(!match){
        throw new BadRequestError("Invalid UUID format for : "+id)
    }
};