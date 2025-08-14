import { Injectable } from "@angular/core";

// задает режим работы панели и кнопки (кнопка в определенные моменты проверяет наличие новых тасков)
@Injectable()
export class CPanelUnviewedService {
    public favorites: boolean = false;

    constructor() {
        this.init();
    }

    public setFavorites(v: boolean): void {
        this.favorites = v;
        this.save();
    }

    ////////////////
    // utils
    ////////////////

    private init(): void {
        let favorites = localStorage.getItem("unviewed-favorites");

        if (favorites) {
            this.favorites = (favorites === "true");
            return;
        }

        this.favorites = false;
        this.save();
    }

    private save(): void {
        localStorage.setItem("unviewed-favorites", String(this.favorites));
    }
}