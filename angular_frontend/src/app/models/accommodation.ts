import { AccommodationRating } from "./accommodationRating";
import { Availability } from "./availability";
import { Photo } from "./photo";
import { Service } from "./service";

export class Accommodation {
	
	private _id?: number;
	private _ownerId!: number;
	private _title!: string;
	private _description?: string;
	private _approvalTimestamp?: Date;
	private _hidingTimestamp?: Date;
	private _beds!: number;
	private _rooms!: number;
	private _street?: string;
	private _streetNumber?: string;
	private _addressNotes?: string;
	private _city?: string;
	private _cap!: string;
	private _province?: string;
	private _country!: string;
	private _coordinates?: string;
	private _mainPhotoUrl!: string;
	private _services: Service[]= [];
	private _photos: Photo[] = [];
	private _availabilities: Availability[] = [];
    private _accomodationRating?: AccommodationRating | undefined;
    

    constructor() 
    {}

    public toJSON() {
        return {
            id: this._id,
            owner_id: this._ownerId,
            title: this._title,
            description: this._description,
            approval_timestamp: this._approvalTimestamp,
            hiding_timestamp: this._hidingTimestamp,
            beds: this._beds,
            rooms: this._rooms,
            street: this._street,
            street_number: this._streetNumber,
            address_notes: this._addressNotes,
            city: this._city,
            cap: this._cap,
            province: this._province,
            country: this._country,
            coordinates: this._coordinates,
            main_photo_url: this._mainPhotoUrl,
            services: this._services,
            photos: this._photos,
            availabilities: this._availabilities
        }
    }

    public toString(): string {
        return "Accommodation [id=" + this.id + ", ownerId=" + this._ownerId + ", title=" + this.title + ", description=" + this.description
        + ", approvalTimestamp=" + this._approvalTimestamp + ", hidingTimestamp=" + this._hidingTimestamp + ", beds=" + this.beds
        + ", rooms=" + this.rooms + ", street=" + this.street + ", streetNumber=" + this._streetNumber + ", addressNotes="
        + this._addressNotes + ", city=" + this.city + ", cap=" + this.cap + ", province=" + this.province + ", country=" + this.country
        + ", coordinates=" + this.coordinates + ", mainPhotoUrl=" + this._mainPhotoUrl + ", services=" + this.services
        + ", photos=" + this.photos + ", availabilities=" + this.availabilities + "]";
    }

    public get id(): (number | undefined) {
        return this._id;
    }
    public set id(value: (number | undefined)) {
        this._id = value;
    }

    public get owner_id(): number {
        return this._ownerId;
    }
    public set owner_id(value: number) {
        this._ownerId = value;
    }

    public get title(): string {
        return this._title;
    }
    public set title(value: string) {
        this._title = value;
    }

    public get description(): (string | undefined) {
        return this._description;
    }
    public set description(value: (string | undefined)) {
        this._description = value;
    }

    public get approval_timestamp(): (Date | undefined) {
        return this._approvalTimestamp;
    }
    public set approval_timestamp(value: (Date | undefined)) {
        this._approvalTimestamp = value;
    }

    public get hiding_timestamp(): (Date | undefined) {
        return this._hidingTimestamp;
    }
    public set hiding_timestamp(value: (Date | undefined)) {
        this._hidingTimestamp = value;
    }

    public get beds(): number {
        return this._beds;
    }
    public set beds(value: number) {
        this._beds = value;
    }

    public get rooms(): number {
        return this._rooms;
    }
    public set rooms(value: number) {
        this._rooms = value;
    }

    public get street(): (string | undefined) {
        return this._street;
    }
    public set street(value: (string | undefined)) {
        this._street = value;
    }

    public get street_number(): (string | undefined) {
        return this._streetNumber;
    }
    public set street_number(value: (string | undefined)) {
        this._streetNumber = value;
    }

    public get address_notes(): (string | undefined) {
        return this._addressNotes;
    }
    public set address_notes(value: (string | undefined)) {
        this._addressNotes = value;
    }

    public get city(): (string | undefined) {
        return this._city;
    }
    public set city(value: (string | undefined)) {
        this._city = value;
    }

    public get cap(): string {
        return this._cap;
    }
    public set cap(value: string) {
        this._cap = value;
    }

    public get province(): (string | undefined) {
        return this._province;
    }
    public set province(value: (string | undefined)) {
        this._province = value;
    }

    public get country(): string {
        return this._country;
    }
    public set country(value: string) {
        this._country = value;
    }

    public get coordinates(): (string | undefined) {
        return this._coordinates;
    }
    public set coordinates(value: (string | undefined)) {
        this._coordinates = value;
    }

    public get main_photo_url(): string {
        return this._mainPhotoUrl;
    }
    public set main_photo_url(value: string) {
        this._mainPhotoUrl = value;
    }

    public get services(): Service[] {
        return this._services;
    }
    public set services(value: Service[]) {
        this._services = value;
    }

    public get photos(): Photo[] {
        return this._photos;
    }
    public set photos(value: Photo[]) {
        this._photos = value;
    }

    public get availabilities(): Availability[] {
        return this._availabilities;
    }
    public set availabilities(value: Availability[]) {
        this._availabilities = value;
    }

    public get rating(): AccommodationRating | undefined {
        return this._accomodationRating;
    }
    public set rating(value: AccommodationRating | undefined) {
        this._accomodationRating = value;
    }
}