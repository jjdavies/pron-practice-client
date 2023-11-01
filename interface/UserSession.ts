import { UserSelection } from "./UserSelection";

export interface UserSession{
    user:string;
    group:string;
    selections:UserSelection[];
}