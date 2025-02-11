export class AccommodationRating {

    private _accommodationId!: number;
    private _rating!: number;


    constructor();
    constructor(accommodationId?: number, rating?: number) {
        this._accommodationId = accommodationId!;
        this._rating = rating!;
    }

    public get accommodationId(): number {
        return this._accommodationId;
    }
    public set accommodationId(value: number) {
        this._accommodationId = value;
    }

    public get rating(): number {
        return this._rating;
    }
    public set rating(value: number) {
        this._rating = value;
    }
}