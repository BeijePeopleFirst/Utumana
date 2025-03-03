import { ReviewDTO } from "../dtos/reviewDTO";
import { Accommodation } from "./accommodation";
import { BadgeAward } from "./badgeAward";

export interface User {
    id?: number;
    name: string;
	surname: string;
	email: string;
	password: string;
	is_admin: boolean;
	bio?: string;
	profile_picture_url?: string;
    profile_picture_blob_url?: string;
	rating?: number;
	archived_timestamp?: Date;
	favourites: Accommodation[];
	reviews: ReviewDTO[];
	badges: BadgeAward[];
}