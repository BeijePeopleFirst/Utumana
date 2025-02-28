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