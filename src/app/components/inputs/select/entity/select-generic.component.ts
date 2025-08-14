import { Directive, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { ILang } from "src/app/model/entities/lang";
import { IWords } from "src/app/model/entities/words";
import { CAppService } from "src/app/services/app.service";
import { CSelectComponent } from "../select.component";

@Directive()
export abstract class CSelectGenericComponent<T> extends CSelectComponent implements OnInit, OnChanges {
    @Input() public value: number;
    @Output() protected valueChange: EventEmitter<number> = new EventEmitter();
    // data
    public currentValue: number = null;
    public currentItem: T = null;
    public items: T[] = null;
    protected sortBy: string = "id";
    protected sortDir: number = 1;
    public search: string = "";

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["value"] && this.value !== this.currentValue /* предотвращаем лишнюю загрузку на случай, когда currentValue будет установлено в onSelect */) {
            this.currentValue = this.value;
            this.initCurrentItem();
        }
    }

    protected abstract initCurrentItem(): Promise<void>;
    protected abstract initItems(): Promise<void>;

    protected override open(): void {
        super.open();
        this.initItems();
    }

    public onSelect(item: T): void {
        this.currentValue = item?.["id"] || null; // ставим здесь "вручную", чтобы не было реакции на onChange и загрузки currentItem с сервера
        this.currentItem = item;
        this.close();
        this.valueChange.emit(this.currentValue);
    }
}