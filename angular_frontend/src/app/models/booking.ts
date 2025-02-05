import { BookingStatus } from "../utils/enums";
import { Accommodation } from "./accommodation";
import { Review } from "./review";

export class Booking{
    constructor(
        public id:number,
        public accommodation:Accommodation,
        public timestamp:string,
        public price: number,
        public status:BookingStatus,
        public check_in:string,
        public check_out:string,
        public is_unavailability:boolean,
        public review:Review,
        public user_id:number
        ) {  }
}