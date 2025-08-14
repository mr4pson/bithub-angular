import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'the-pagination',
    templateUrl: './pagination.component.html',  
    styleUrls: ['./pagination.component.scss'],
})
export class CPaginationComponent implements OnChanges {
    @Input() n: number = 0;
    @Input() value: number = 0;
    @Output() valueChange: EventEmitter<number> = new EventEmitter ();    

    public parts: number[] = [];

    public ngOnChanges(changes: SimpleChanges): void {
        this.initParts();
    }

    private initParts(): void {
        this.parts = [];        
        
        for (let i = 0; i < this.n; i++) {
            if (!i || i == this.n - 1) { // first and last            
                this.parts.push(i);
            } else { // middle            
                if (i - this.value > 1) {
                    this.parts.push(-1);
                } else if (this.value - i > 1) {
                    this.parts.push(-2);
                } else {
                    this.parts.push(i);
                }
            }            
        }

        this.parts = [...new Set(this.parts)]; // array_unique
    }    

    public onSelect (v: number): void {        
        if (v >= 0 && v !== this.value) {            
            this.valueChange.emit(v);                
        }        
    }

    public onBack(): void {
        if (this.value > 0) {
            this.valueChange.emit(this.value - 1);            
        }
    }

    public onForward(): void {
        if (this.value < this.n - 1) {                        
            this.valueChange.emit(this.value + 1);            
        }
    }    
}
