import { BadRequestError } from "../exceptions/errors";

export function isValidPlateNumber(plate: string) {
  // Allow uppercase/lowercase letters, digits, and spaces
  const plateRegex = /^[A-Za-z0-9 ]+$/;
  const match =  plateRegex.test(plate) && plate.trim().length > 0;

  if(!match){
    throw new BadRequestError("Invalid plate number! It must contain only letters, digits, and spaces");
  }
}
