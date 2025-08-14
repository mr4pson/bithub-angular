import { Directive, Input } from "@angular/core";
import { CAppService } from "../../services/app.service";
import { CColor } from "src/app/model/color";
import { IWords } from "src/app/model/entities/words";
import { ILang } from "src/app/model/entities/lang";

@Directive()
export abstract class CScoreDiagramComponent {
    @Input() public value: number = 0;
    public currentValue: number = 0;
    public radius: number = 45;
    public color3: CColor = new CColor(0, 0xff, 0x38);
    public color2: CColor = new CColor(0xfa, 0xff, 0);
    public color1: CColor = new CColor(0xff, 0x0f, 0);

    constructor(protected appService: CAppService) {}

    get color(): string {return this.appService.colorGradient(this.currentValue/1000, this.color1, this.color2, this.color3).toString();}
    get roundedValue(): string {return this.currentValue.toFixed();}
    get words(): IWords {return this.appService.words;}
    get lang(): ILang {return this.appService.lang.value;}

    public ngOnChanges(): void {
        if (this.value < 0) {
            this.currentValue = 0;
            return;
        }

        if (this.value > 1000) {
            this.currentValue = 1000;
            return;
        }

        this.currentValue = this.value;
    }

    public strokeDashArray(v: number): string {
        const alpha = v * Math.PI / 1000;
        const arc1 = alpha * this.radius;
        const arc2 = (2 * Math.PI - alpha) * this.radius;
        let sda = `${arc1}, ${arc2}`;
        return sda;
    }
}