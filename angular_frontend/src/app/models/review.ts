export interface Review{
    title: string,
    description: string,
    overall_rating: number,
    comfort: number,
    convenience: number,
    position: number,
    id:number|null,
    approval_timestamp: string|null,
    booking_id: number|null,
    name_user?: string,
    image_user?: string,
    user_picture_blob?: string,
    accommodation_id?: number
}