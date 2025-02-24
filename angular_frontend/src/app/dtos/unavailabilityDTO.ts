export class UnavailabilityDTO{
    constructor(
        public id: number,
        public check_in: string,
        public check_out: string
        ) {  }
}

export interface UnavailabilityInterface {
    id?: number,
    check_in: string,
    check_out: string,
    accommodation_draft_id?: number
}