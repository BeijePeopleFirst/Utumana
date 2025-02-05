export class AccommodationDTO{
    constructor(
        public id: number,
        public title: string,
        public city: string,
        public main_photo_url: string,
        public country: string,
        public province: string,
        public min_price: number,
        public max_price: number,
        public is_favourite:boolean
        ) {  }
}