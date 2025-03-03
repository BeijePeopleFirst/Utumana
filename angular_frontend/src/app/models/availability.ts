export interface Availability {
  id?: number,
  start_date: string, 
  end_date: string, 
  price_per_night: number,
  accommodation_id?: number,
  accommodation_draft_id?: number
}