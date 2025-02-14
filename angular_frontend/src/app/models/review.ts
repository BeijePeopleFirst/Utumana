export class Review{
    constructor(
        public title: string,
        public description: string,
        public overallRating: number,
        public comfort: number,
        public convenience: number,
        public position: number,
        public id:number|null,
        public approval_timestamp: string|null,
        public bookingId: number|null,
        public author?: string,
        ) {  }
}