import { AfterViewInit, Directive, ElementRef, ViewChild } from "@angular/core";
import { CSelectGenericComponent } from "./select-generic.component";

@Directive()
export abstract class CSelectEndlessComponent<T> extends CSelectGenericComponent<T> implements AfterViewInit {
    // iface
    @ViewChild("container", {static: false}) protected containerRef: ElementRef;
    // data
    protected part: number = 0;
    protected chunkLength: number = 20;
    protected exhausted: boolean = false;  
    protected started_at: Date = null;
    public loadingMore: boolean = false;

    get container(): HTMLElement {return this.containerRef.nativeElement;}
    get scrolledToBottom(): boolean {return this.container.scrollTop >= this.container.scrollHeight - this.container.offsetHeight - 100;}
    get canLoadMore(): boolean {return this.items?.length /*важно,чтоб не было подгрузки до первой загрузки*/ && !this.loadingMore && !this.exhausted && this.scrolledToBottom;}   

    public ngAfterViewInit(): void {
        this.container.addEventListener("scroll", this.onScroll.bind(this));
    }

    protected abstract onScroll(): Promise<void>;
}