export interface Activity{
    id:number;
    uuid:string;
    title:string;
    options:string[];
    preceding:string;
    fileuuid:string;
    deleted:boolean;
}