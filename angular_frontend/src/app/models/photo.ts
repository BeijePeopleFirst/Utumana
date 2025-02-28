export class Photo {
    constructor(
        public id:number,
        public photo_url:string,
        public photo_order: number,
        public blob_url?:string
        ) {  }
}