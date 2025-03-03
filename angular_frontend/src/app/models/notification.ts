export interface Notification{
    id:number,
    title:string,
    description?:string,
    readTimestamp?: string,
    onClickUrl?:string,
    userId:number
}