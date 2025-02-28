import { AccommodationRating } from "./accommodationRating";
import { Availability } from "./availability";
import { Photo } from "./photo";
import { Service } from "./service";

export interface Accommodation {
	id?: number;
	owner_id: number;
	title: string;
	description?: string;
	approval_timestamp?: Date;
	hiding_timestamp?: Date;
	beds: number;
	rooms: number;
	street?: string;
	street_number?: string;
	address_notes?: string;
	city?: string;
	cap?: string;
	province?: string;
	country: string;
	coordinates?: string;
	main_photo_url: string;
	services: Service[];
	photos: Photo[];
	availabilities: Availability[];
    rating?: AccommodationRating;
}