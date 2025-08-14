import { Injectable } from "@angular/core";
import { TDeskMode } from "src/app/model/entities/desk";

// отвечает за режим таскера
@Injectable()
export class CTaskerService {
    private lsVar: string = "tasker-mode";
    public mode: TDeskMode = null;

    constructor() {
        this.init();
    }

    public setMode(mode: TDeskMode): void {
        this.mode = mode;
        this.save();
    }

    ////////////////
    // utils
    ////////////////

    private init(): void {
        this.mode = localStorage.getItem(this.lsVar) as TDeskMode;

        if (!this.mode) {
            this.mode = "public";
            this.save();
        }
    }

    private save(): void {
        localStorage.setItem(this.lsVar, this.mode);
    }
}