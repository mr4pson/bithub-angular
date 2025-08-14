export interface IDatemarkToggle {
    readonly guide_id: number;
    readonly type: TDatemarkType;
    readonly date: string;
}

export interface IDatemarkGetList {
    readonly guide_id: number;
    readonly type: TDatemarkType;
    readonly month: number;
    readonly year: number;
}

export type TDatemarkType = "reminder" | "execution";
