export interface AccommodationDTO{
    id: number,
    title: string,
    city: string,
    main_photo_url: string,
    country: string,
    province: string,
    min_price: number,
    max_price: number,
    is_favourite:boolean,
    rating: number,
    coordinates?: string,
    main_photo_blob_url?: string,
}