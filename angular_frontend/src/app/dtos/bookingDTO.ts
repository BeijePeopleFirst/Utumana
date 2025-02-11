import { BookingStatus } from "../utils/enums";
import { AccommodationDTO } from "./accommodationDTO";

export class BookingDTO {
  private _id?: number;
  private _checkIn!: string;
  private _checkOut!: string;
  private _price!: number;
  private _status!: string;
  private _reviewId?: number;
  private _accommodation!: AccommodationDTO;

  constructor(
    checkIn: string,
    checkOut: string,
    price: number,
    status: string,
    accommodation: AccommodationDTO
  );

  constructor(
    checkIn: string,
    checkOut: string,
    price: number,
    status: string,
    accommodation: AccommodationDTO,
    reviewId?: number,
    id?: number
  ) {
    this._accommodation = accommodation;
    this._checkIn = checkIn;
    this._checkOut = checkOut;
    this._id = id;
    this._price = price;
    this._reviewId = reviewId;
    this._status = status;
  }

  public get id(): number | undefined {
    return this._id;
  }
  public set id(value: number | undefined) {
    this._id = value;
  }

  public get checkIn(): string {
    return this._checkIn;
  }
  public set checkIn(value: string) {
    this._checkIn = value;
  }

  public get checkOut(): string {
    return this._checkOut;
  }
  public set checkOut(value: string) {
    this._checkOut = value;
  }

  public get price(): number {
    return this._price;
  }
  public set price(value: number) {
    this._price = value;
  }

  public get status(): string {
    return this._status;
  }
  public set status(value: string) {
    this._status = value;
  }

  public get reviewId(): number | undefined {
    return this._reviewId;
  }
  public set reviewId(value: number | undefined) {
    this._reviewId = value;
  }

  public get accommodation(): AccommodationDTO {
    return this._accommodation;
  }
  public set accommodation(value: AccommodationDTO) {
    this._accommodation = value;
  }
}