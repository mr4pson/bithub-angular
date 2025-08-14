import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { CCalendarComponent } from "src/app/components/inputs/dates/calendar";
import { IDatemarkGetList, IDatemarkToggle, TDatemarkType } from "src/app/model/dto/datemarks";
import { CUser } from "src/app/model/entities/user";
import { CAppService } from "src/app/services/app.service";
import { CAuthService } from "src/app/services/auth.service";
import { CDatemarkRepository } from "src/app/services/repositories/datemark.repository";

@Component({
    selector: "datemarks-calendar",
    templateUrl: "datemarks-calendar.component.html",
    styleUrls: ["datemarks-calendar.component.scss"]
})
export class CDatemarksCalendarComponent extends CCalendarComponent implements OnChanges {
    @Input() public guide_id: number;
    @Input() public type: TDatemarkType;
    @Input() public compact: boolean = false;

    public datemarks: number[] = [];
    public loading: boolean = false;

    constructor(
        protected override appService: CAppService,
        protected authService: CAuthService,
        protected datemarkRepository: CDatemarkRepository,
    )
    {
        super(appService);
    }

    get user(): CUser {return this.authService.user;}
    get filter(): any {return ;}

    //////////////////
    // lifecycle
    //////////////////

    ngOnChanges(): void {
        this.initCalendar();
        this.initDatemarks();
    }

    protected initCalendar(): void {
        const iniValue = this.appService.mysqlDate(new Date());
        const dateParts = iniValue.split("-");
        this.month = parseInt(dateParts[1]) - 1; // месяцы удобнее с нуля при построении календаря
        this.year = parseInt(dateParts[0]);
        this.buildDays();
    }

    protected async initDatemarks(): Promise<void> {
        try {
            this.loading = true;
            this.datemarks = [];
            const dto: IDatemarkGetList = {guide_id: this.guide_id, type: this.type, month: this.month+1, year: this.year};
            await this.appService.pause(300);
            this.datemarks = await this.datemarkRepository.loadAll(dto);
            this.loading = false;
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    ////////////////
    // events
    ////////////////

    public override onMonthBack(): void {
        super.onMonthBack();
        this.initDatemarks();
    }

    public override onMonthNext(): void {
        super.onMonthNext();
        this.initDatemarks();
    }

    public async onDayToggle(day: number): Promise<void> {
        try {
            this.datemarks.includes(day) ? this.datemarks.splice(this.datemarks.indexOf(day), 1) : this.datemarks.push(day);
            const dto: IDatemarkToggle = {guide_id: this.guide_id, type: this.type, date: `${this.year}-${this.appService.twoDigits(this.month+1)}-${this.appService.twoDigits(day)}`};
            await this.datemarkRepository.toggle(dto);
        } catch (err) {
            this.appService.notifyError(err);
        }
    }
}
