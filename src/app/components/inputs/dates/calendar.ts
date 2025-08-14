import { Directive } from "@angular/core";
import { IDay } from "./day";
import { CAppService } from "src/app/services/app.service";
import { ILang } from "src/app/model/entities/lang";
import { IWords } from "src/app/model/entities/words";

@Directive()
export abstract class CCalendarComponent {
    // calendar
    public days: IDay[] = []; 
    public year: number = null; 
    public month: number = null;
    // selected
    public currentYear: number = null; 
    public currentMonth: number = null; 
    public currentDay: number = null;  
    
    constructor(protected appService: CAppService) {}
    
    get lang(): ILang {return this.appService.lang.value;}
    get words(): IWords {return this.appService.words;}
    get shortYear(): string {return `'${this.year.toString().substring(2, 4)}`;}

    protected buildDays(): void {
        const now = new Date();
        const firstDayOfMonth = this.appService.firstDayOfWeekInMonth(this.month, this.year);
        const daysInMonth = this.appService.daysInMonth(this.month, this.year);      
        this.days = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            this.days.push({hidden: true});
        }

        for (let i = 0; i < daysInMonth; i++) {
            const day: IDay = {n: i+1};
            const index = firstDayOfMonth + i + 1;
            day.holiday = !(index % 7) || !((index+1) % 7); 
            day.now = i + 1 === now.getDate() && this.month === now.getMonth() && this.year === now.getFullYear();  
            day.past = new Date(`${this.year}-${this.month+1}-${day.n} 23:59:59`).getTime() < now.getTime();
            this.days.push(day);                            
        }
    }    

    public onMonthBack(): void {
        if (this.month === 0) {
            if (this.year > 1000) {
                this.month = 11;
                this.year--;
            }            
        } else {
            this.month--;
        }

        this.buildDays();
    }

    public onMonthNext(): void {
        if (this.month === 11) {
            if (this.year < 9999) {
                this.month = 0;
                this.year++;
            }            
        } else {
            this.month++;
        }

        this.buildDays();
    }    
}
