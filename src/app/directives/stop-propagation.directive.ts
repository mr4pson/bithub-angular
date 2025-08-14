import { Directive, HostListener } from "@angular/core";

@Directive({
    selector: "[stop-propagation]",
})
export class CStopPropagationDirective {
    @HostListener("click", ["$event"])
    public onClick(event: PointerEvent): void {
        event.stopPropagation();
    }
}
