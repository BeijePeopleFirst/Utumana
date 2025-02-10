import { BookingStatus } from "../utils/enums";
import { AccommodationDTO } from "./accommodationDTO";

export class BookingDTO{
    constructor(
        public id: number,
        public checkIn: string,
        public checkOut: string,
        public price: number,
        public status: string,
        public reviewId: number,
        public accommodation:AccommodationDTO
        ) {  }
}