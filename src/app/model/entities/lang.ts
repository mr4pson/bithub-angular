import { IEntity } from "./_entity";

export interface ILang extends IEntity {
    readonly slug: string;    
    readonly title: string;
    readonly shorttitle: string;
    readonly dir: TDir; 
    readonly dateformat: TDateFormat;
}

// [mm/dd/yyyy], [Month dd, yyyy]
// [dd.mm.yyyy], [dd month yyyy]
export type TDateFormat = "en" | "ru";

export type TDir = "ltr" | "rtl";
