import { Badge } from "./badge";
import { BadgeAwardKey } from "./badgeAwardKey";

export class BadgeAward{
    constructor(
        public id:BadgeAwardKey,
        public badge: Badge,
        public award_date:string
        ) {  }
}