import { ReviewDTO } from "../dtos/reviewDTO";
import { Accommodation } from "./accommodation";

export class User {

    private _id?: number;
    private _name!: string;
	private _surname!: string;
	private _email!: string;
	private _password!: string;
	private _isAdmin!: boolean;
	private _bio?: string;
	private _profilePictureUrl?: string;
	private _rating?: number;
	private _archivedTimestamp?: Date;
	private _favourites: Accommodation[] = [];
	private _reviews: ReviewDTO[] = [];


    constructor() {}

    public get id(): number | undefined {
        return this._id;
    }
    public set id(value: number | undefined) {
        this._id = value;
    }
	
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public get surname(): string {
        return this._surname;
    }
    public set surname(value: string) {
        this._surname = value;
    }

    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }

    public get password(): string {
        return this._password;
    }
    public set password(value: string) {
        this._password = value;
    }

    public get isAdmin(): boolean {
        return this._isAdmin;
    }
    public set isAdmin(value: boolean) {
        this._isAdmin = value;
    }

    public get bio(): string | undefined {
        return this._bio;
    }
    public set bio(value: string | undefined) {
        this._bio = value;
    }

    public get profilePictureUrl(): string | undefined {
        return this._profilePictureUrl;
    }
    public set profilePictureUrl(value: string | undefined) {
        this._profilePictureUrl = value;
    }

    public get rating(): number | undefined {
        return this._rating;
    }
    public set rating(value: number | undefined) {
        this._rating = value;
    }

    public get archivedTimestamp(): Date | undefined {
        return this._archivedTimestamp;
    }
    public set archivedTimestamp(value: Date | undefined) {
        this._archivedTimestamp = value;
    }

    public get favourites(): Accommodation[] {
        return this._favourites;
    }
    public set favourites(value: Accommodation[]) {
        this._favourites = value;
    }

    public get reviews(): ReviewDTO[] {
        return this._reviews;
    }
    public set reviews(value: ReviewDTO[]) {
        this._reviews = value;
    }

}