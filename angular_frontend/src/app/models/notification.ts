export class Notification{
    constructor(
        public id:number,
        public title:string,
        public description:string,
        public readTimestamp: string,
        public onClickUrl:string,
        public userId:number
        ) {  }
}