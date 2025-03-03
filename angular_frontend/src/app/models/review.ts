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
    author?: string,
}