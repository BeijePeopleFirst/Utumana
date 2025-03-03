import { BookingStatus } from "../utils/enums";
import { Accommodation } from "./accommodation";
import { Review } from "./review";

export interface Booking {
  accommodation: Accommodation;
  timestamp: string;
  price: number;
  status: BookingStatus;
  check_in: string;
  check_out: string;
  is_unavailability: boolean;
  user_id: number;
  review?: Review;
  id?: number;
}