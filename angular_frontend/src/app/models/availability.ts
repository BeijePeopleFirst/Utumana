export class Availability {

  public id: number;
  public start_date: string;
  public end_date: string;
  public price_per_night: number;
  public accommodation_id: number;


  constructor();

  constructor(
    id?: number,
    start_date?: string,
    end_date?: string,
    price_per_night?: number,
    accommodation_id?: number
  ) {
    this.id = id!;
    this.start_date = start_date!;
    this.end_date = end_date!;
    this.price_per_night = price_per_night!;
    this.accommodation_id = accommodation_id!;
  }

  
}