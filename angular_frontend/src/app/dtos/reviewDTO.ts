export class ReviewDTO {
    constructor(
        public id: number,
        public title: string,
        public description: string,
        public overallRating: number,
        public approval_timestamp: string  
        ) {  }
}