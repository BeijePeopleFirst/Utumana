export class Availability {
    constructor(
        public id:number,
        public start_date: string,
        public end_date: string,
        public price_per_night: number,
        public accommodation_id: number,
        ) {  }
}