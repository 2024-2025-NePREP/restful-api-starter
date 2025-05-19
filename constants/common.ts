export const AUTH_COOKIE_NAME = 'auth_token'

export enum UserRole {
  USER="USER",
  ADMIN="ADMIN"
}

export enum VehicleType {
  CAR="CAR",
  MOTORCYCLE="MOTORCYCLE",
  TRUCK="TRUCK",
  VAN="VAN",
  SUV="SUV"
}

export enum VehicleSize {
  SMALL="SMALL",
  MEDIUM="MEDIUM",
  LARGE="LARGE"
}

export enum ParkingSlotStatus {
  AVAILABLE="AVAILABLE",
  OCCUPIED="OCCUPIED"
}

export enum SlotRequestStatus {
  PENDING="PENDING",
  APPROVED="APPROVED",
  REJECTED="REJECTED"
}

export enum ParkingLocation {
  NORTH="NORTH",
  SOUTH="SOUTH",
  EAST="EAST",
  WEST="WEST"
}

export enum VERIFICATION_CODE_STATUS{
    AVAILABLE="AVAILABLE",
    USED="USED"
}

export enum EMAIL_CONTEXT{
    OTP="OTP",
    PASSWORD_RESET="PASSWORD_RESET"
}