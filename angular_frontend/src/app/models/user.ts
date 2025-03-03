import { Accommodation } from "./accommodation";
import { BadgeAward } from "./badgeAward";
import { Review } from "./review";

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
	reviews: Review[];
	badges: BadgeAward[];
}