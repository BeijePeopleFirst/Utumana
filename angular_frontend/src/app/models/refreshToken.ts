export class RefreshToken{
    constructor(
        public id:number,
        public userId:number,
        public refresh_token: string | null,
        public timeStamp: string,
        ) {  }
}