import { BookingStatus } from "../utils/enums";
import { Accommodation } from "./accommodation";
import { Review } from "./review";

export class Booking {
  private _accommodation: Accommodation;
  private _timestamp!: string;
  private _price!: number;
  private _status!: BookingStatus;
  private _check_in!: string;
  private _check_out!: string;
  private _is_unavailability!: boolean;
  private _user_id!: number;
  private _review?: Review;
  private _id?: number;


  constructor(
    accommodation: Accommodation,
    timestamp: string,
    price: number,
    status: BookingStatus,
    check_in: string,
    check_out: string,
    is_unavailability: boolean,
    user_id: number
  );

  constructor(
    accommodation: Accommodation,
    timestamp: string,
    price: number,
    status: BookingStatus,
    check_in: string,
    check_out: string,
    is_unavailability: boolean,
    user_id: number,
    review?: Review,
    id?: number
  ) {
    this._accommodation = accommodation;
    this._timestamp = timestamp;
    this._price = price;
    this._status = status;
    this._check_in = check_in;
    this._check_out = check_out;
    this._is_unavailability = is_unavailability;
    this._user_id = user_id;
    this._review = review;
    this._id = id;
  }

  public get accommodation(): Accommodation {
    return this._accommodation;
  }
  public set accommodation(value: Accommodation) {
    this._accommodation = value;
  }

  public get timestamp(): string {
    return this._timestamp;
  }
  public set timestamp(value: string) {
    this._timestamp = value;
  }

  public get price(): number {
    return this._price;
  }
  public set price(value: number) {
    this._price = value;
  }

  public get status(): BookingStatus {
    return this._status;
  }
  public set status(value: BookingStatus) {
    this._status = value;
  }

  public get check_in(): string {
    return this._check_in;
  }
  public set check_in(value: string) {
    this._check_in = value;
  }

  public get check_out(): string {
    return this._check_out;
  }
  public set check_out(value: string) {
    this._check_out = value;
  }

  public get is_unavailability(): boolean {
    return this._is_unavailability;
  }
  public set is_unavailability(value: boolean) {
    this._is_unavailability = value;
  }

  public get user_id(): number {
    return this._user_id;
  }
  public set user_id(value: number) {
    this._user_id = value;
  }

  public get review(): Review | undefined {
    return this._review;
  }
  public set review(value: Review | undefined) {
    this._review = value;
  }

  public get id(): number | undefined {
    return this._id;
  }
  public set id(value: number | undefined) {
    this._id = value;
  }

}