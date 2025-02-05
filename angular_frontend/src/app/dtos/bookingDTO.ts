import { BookingStatus } from "../utils/enums";

export class BookingDTO{
    constructor(
        public id: number,
        public accommodationMainPhotoURL: string,
        public accommodationName: string,
        public checkIn: string,
        public checkOut: string,
        public price: number,
        public status: BookingStatus,
        public accommodationId: number,
        public reviewId: number
        ) {  }
}