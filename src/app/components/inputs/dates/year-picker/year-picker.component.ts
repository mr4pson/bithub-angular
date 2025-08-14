import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { ILang } from "src/app/model/entities/lang";
import { CAppService } from "src/app/services/app.service";

@Component({
    selector: "year-picker",
    templateUrl: "year-picker.component.html",
    styleUrls: ["year-picker.component.scss"],
})
export class CYearPickerComponent implements OnChanges {
    @Input() public value: number;
    @Output() private valueChange: EventEmitter<number> = new EventEmitter();
    @Output() private close: EventEmitter<void> = new EventEmitter();
    
    // data
    public from: number = 0;
    public years: number[] = [];
    public now: number = 0;
    // iface
    protected interval: number = null;
    protected timeout: number = null; 

    constructor(private appService: CAppService) {}

    get lang(): ILang {return this.appService.lang.value;}
    get to(): number {return this.from + 9;}

    public ngOnChanges(changes: SimpleChanges): void {
        this.now = new Date().getFullYear();
        this.from = parseInt(`${Math.floor(this.value / 10).toString()}0`);
        this.buildYears();
    }

    private buildYears(): void {
        this.years = this.appService.range(this.from, this.to);        
    }

    public onClose(): void {
        this.close.emit();
    }

    public onBack(): void {
        this.back();
        this.timeout = window.setTimeout(() => this.interval = window.setInterval(() => this.back(), 100), 1000);
    }

    public onForward(): void {
        this.forward();
        this.timeout = window.setTimeout(() => this.interval = window.setInterval(() => this.forward(), 100), 1000);
    }

    private back(): void {
        if (this.from < 1010) return;
        this.from -= 10;
        this.buildYears();
    }

    private forward(): void {
        if (this.from > 9980) return;
        this.from += 10;
        this.buildYears();
    }

    public onSelect(year: number): void {
        this.valueChange.emit(year);
        this.onClose();
    }
    
    @HostListener('window:mouseup')
    public onMouseUp(): void {        
        this.timeout && window.clearTimeout(this.timeout);
        this.interval && window.clearInterval(this.interval);        
    }
}