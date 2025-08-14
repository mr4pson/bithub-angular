import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from "@angular/core";
import { CCalendarComponent } from "../calendar";

@Component({
    selector: "date-picker",
    templateUrl: "date-picker.component.html",
    styleUrls: ["date-picker.component.scss"],
})
export class CDatePickerComponent extends CCalendarComponent implements OnChanges {
    @Input() public value: string;
    @Input() public resetable: boolean = false;
    @Input() public resetValue: undefined | null = undefined; // какое значение ставим при сбросе
    @Output() private valueChange: EventEmitter<string> = new EventEmitter();    

    // iface        
    @ViewChild("btnelement", {static: false}) private btnElementRef: ElementRef;
    public calendarActive: boolean = false;
    protected calendarHeight: number = 305;
    protected calendarWidth: number = 260;
    public calendarTop: string = "";    
    public calendarLeft: string = ""; 
    public yearPickerActive: boolean = false;
    protected interval: number = null;
    protected timeout: number = null; 

    get btnElement(): HTMLElement {return this.btnElementRef.nativeElement;}  
    get formattedDate(): string {
        if (!this.value) return this.words["common"]?.["empty3"]?.[this.lang.slug];
        const dateParts = this.value.split("-");
        const day = parseInt(dateParts[2]);
        const month = parseInt(dateParts[1]);
        const year = parseInt(dateParts[0]);
        return `${this.appService.twoDigits(day)}.${this.appService.twoDigits(month)}.${year}`;        
    }

    ngOnChanges(changes: SimpleChanges): void {        
        changes["value"] && this.initCurrentDate();
    }

    protected initCurrentDate(): void {        
        if (!this.value) {
            this.currentDay = this.currentMonth = this.currentYear = null;
            return;
        }

        const dateParts = this.value.split("-");
        this.currentDay = parseInt(dateParts[2]);
        this.currentMonth = parseInt(dateParts[1]) - 1; // месяцы удобнее с нуля при построении календаря
        this.currentYear = parseInt(dateParts[0]);        
    }

    protected initCalendar(): void {
        const iniValue = this.value || this.appService.mysqlDate(new Date());
        const dateParts = iniValue.split("-");
        this.month = parseInt(dateParts[1]) - 1; // месяцы удобнее с нуля при построении календаря
        this.year = parseInt(dateParts[0]);
        this.buildDays();        
    }

    public isCurrent(day: number): boolean {   
        return this.year === this.currentYear && this.month === this.currentMonth && day === this.currentDay;
    }

    public onActivateCalendar(): void {
        this.initCalendar();
        const btnLeft = this.btnElement.getBoundingClientRect().left; 
        const btnRight = this.btnElement.getBoundingClientRect().right; 
        const btnTop = this.btnElement.getBoundingClientRect().top;   
        const btnBottom = this.btnElement.getBoundingClientRect().bottom;   
        this.calendarLeft = this.lang.dir === "ltr" ? `${btnLeft}px` : `${btnRight - this.calendarWidth}px`;
        this.calendarTop = (btnBottom + this.calendarHeight + 3 > window.innerHeight && btnTop - this.calendarHeight - 3 > window.innerHeight - (btnBottom + this.calendarHeight + 3)) ? 
            `${btnTop - this.calendarHeight - 3}px` : 
            `${btnBottom + 3}px`;        
        this.calendarActive = true;
    }  

    public onSetDay(day: number): void {        
        this.valueChange.emit(`${this.year}-${this.appService.twoDigits(this.month+1)}-${this.appService.twoDigits(day)}`);
        this.onClose();
    }

    public onReset(event: Event): void {
        event.stopPropagation();
        this.valueChange.emit(this.resetValue);
    }

    public onClose(): void {
        this.calendarActive = false;
        this.yearPickerActive = false;
    }

    public override onMonthBack(): void {
        super.onMonthBack();
        this.timeout = window.setTimeout(() => this.interval = window.setInterval(() => super.onMonthBack(), 100), 500);
    }

    public override onMonthNext(): void {
        super.onMonthNext();
        this.timeout = window.setTimeout(() => this.interval = window.setInterval(() => super.onMonthNext(), 100), 500);
    }

    @HostListener('window:resize')
    public onResize(): void {        
        this.onClose();
    }

    @HostListener('window:mouseup')
    public onMouseUp(): void {     
        this.timeout && window.clearTimeout(this.timeout);
        this.interval && window.clearInterval(this.interval);        
    }
}