export class Availability {

  private _id: number;
  private _start_date: string;
  private _end_date: string;
  private _price_per_night: number;
  private _accommodation_id: number;


  constructor();

  constructor(
    id?: number,
    start_date?: string,
    end_date?: string,
    price_per_night?: number,
    accommodation_id?: number
  ) {
    this._id = id!;
    this._start_date = start_date!;
    this._end_date = end_date!;
    this._price_per_night = price_per_night!;
    this._accommodation_id = accommodation_id!;
  }

  public get id(): number {
    return this._id;
  }
  public set id(value: number) {
    this._id = value;
  }

  public get start_date(): string {
    return this._start_date;
  }
  public set start_date(value: string) {
    this._start_date = value;
  }

  public get end_date(): string {
    return this._end_date;
  }
  public set end_date(value: string) {
    this._end_date = value;
  }

  public get price_per_night(): number {
    return this._price_per_night;
  }
  public set price_per_night(value: number) {
    this._price_per_night = value;
  }

  public get accommodation_id(): number {
    return this._accommodation_id;
  }
  public set accommodation_id(value: number) {
    this._accommodation_id = value;
  }
  
}

export interface AvailabilityInterface {
  id?: number,
  start_date: string, 
  end_date: string, 
  price_per_night: number,
  accommodation_id?: number,
  accommodation_draft_id?: number
}