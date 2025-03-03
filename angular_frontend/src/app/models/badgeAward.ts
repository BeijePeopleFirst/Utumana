import { Badge } from "./badge";
import { BadgeAwardKey } from "./badgeAwardKey";

export interface BadgeAward{
    id:BadgeAwardKey;
    badge: Badge;
    award_date:string;
}