import { Availability } from "./availability";
import { Photo } from "./photo";
import { Service } from "./service";

export class Accommodation {
	
	private _id!: number;
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


    constructor() 
    {}

    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    public get ownerId(): number {
        return this._ownerId;
    }
    public set ownerId(value: number) {
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
    public set description(value: string) {
        this._description = value;
    }

    public get approvalTimestamp(): (Date | undefined) {
        return this._approvalTimestamp;
    }
    public set approvalTimestamp(value: Date) {
        this._approvalTimestamp = value;
    }

    public get hidingTimestamp(): (Date | undefined) {
        return this._hidingTimestamp;
    }
    public set hidingTimestamp(value: Date) {
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
    public set street(value: string) {
        this._street = value;
    }

    public get streetNumber(): (string | undefined) {
        return this._streetNumber;
    }
    public set streetNumber(value: string) {
        this._streetNumber = value;
    }

    public get addressNotes(): (string | undefined) {
        return this._addressNotes;
    }
    public set addressNotes(value: string) {
        this._addressNotes = value;
    }

    public get city(): (string | undefined) {
        return this._city;
    }
    public set city(value: string) {
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
    public set province(value: string) {
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
    public set coordinates(value: string) {
        this._coordinates = value;
    }

    public get mainPhotoUrl(): string {
        return this._mainPhotoUrl;
    }
    public set mainPhotoUrl(value: string) {
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

}