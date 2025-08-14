import { IKeyValue } from "../keyvalue";

export type IFiles = IKeyValue<IFile>;

export interface IFile {
    readonly filename: string;
    readonly fileurl: string;
    readonly filetype: string;
}
