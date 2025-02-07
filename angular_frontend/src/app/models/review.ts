export class Review{
    constructor(
        public id:number,
        public bookingId: number,
        public title: string,
        public description: string,
        public approval_timestamp: string,
        public overallRating: number,
        public comfort: number,
        public convenience: number,
        public position: number,
        public author?: string
        ) {  }
}