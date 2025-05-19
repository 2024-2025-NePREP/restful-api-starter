import { BadRequestError } from "../exceptions/errors";

export const validateEnums = (enumChecks: { [key: string]: { value: any; enumType: any } }) => {
    for (const [key, { value, enumType }] of Object.entries(enumChecks)) {
      if (!Object.values(enumType).includes(value)) {
        throw new BadRequestError(
          `Invalid ${key}. Allowed values are: ${Object.values(enumType).join(", ")}`
        );
      }
      
    }
  };
  