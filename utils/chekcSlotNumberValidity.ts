import { BadRequestError } from "../exceptions/errors";

export function isValidSlotNumber(slotNumber: string): void {
  // Only allow letters (uppercase/lowercase) and digits, no spaces
  const slotNumberRegex = /^[A-Za-z0-9]+$/;
  const isValid = slotNumberRegex.test(slotNumber) && slotNumber.length > 0;

  if (!isValid) {
    throw new BadRequestError(
      "Invalid slot number! It must contain only letters and numbers"
    );
  }
}