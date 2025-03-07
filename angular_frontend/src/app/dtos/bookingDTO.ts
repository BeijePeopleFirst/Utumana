import { Accommodation } from "../models/accommodation";
import { BookingStatus } from "../utils/enums";
import { AccommodationDTO } from "./accommodationDTO";

export interface BookingDTO {
  id?: number;
  check_in: string;
  check_out: string;
  price: number;
  status: string;
  review_id?: number;
  accommodation: AccommodationDTO;
}

export interface PartialBooking {
  id?: number;
  check_in?: Date;
  check_out?: Date;
  price?: number;
  status?: string;
  review_id?: number;
  accommodation?: Accommodation;
  price_info?: {
    nights: number,
    price_per_night: number
  }[]
}