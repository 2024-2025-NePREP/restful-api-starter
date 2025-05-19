import { BadRequestError } from "../exceptions/errors";

export function validateStartAndEndDates(startDate: any, endDate: any) {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime())) {
    throw new BadRequestError("Invalid date format for startDate");
  }

  if(isNaN(end.getTime())){
    throw new BadRequestError("Invalid date format for endDate")
  }

  if (start < now || end < now) {
    throw new BadRequestError("startDate and endDate must not be in the past.");
  }

  if (start > end) {
    throw new BadRequestError("startDate must be before endDate.");
  }

}
