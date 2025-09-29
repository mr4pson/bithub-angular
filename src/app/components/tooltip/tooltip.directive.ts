import {
  Directive,
  Input,
  ElementRef,
  HostListener,
  Renderer2,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[lsm-tooltip]',
})
export class TooltipDirective implements OnInit {
  @Input('lsm-tooltip') tooltipTitle: string;
  tooltip: HTMLElement;
  tooltipHeader: HTMLElement;
  offset = 16;
  placement = 'top';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    //this.showTooltip();
  }
  @HostListener('mouseover')
  onMouseIn() {
    if (!this.tooltip) this.showTooltip();
  }

  @HostListener('mouseleave')
  onMouseOut() {
    if (this.tooltip) this.hideTooltip();
  }

  showTooltip() {
    console.log('show');

    this.tooltip = this.renderer.createElement('span');
    this.tooltipHeader = this.renderer.createComment('span');

    this.renderer.appendChild(
      this.tooltip,
      this.renderer.createText(this.tooltipTitle)
    );

    this.renderer.appendChild(document.body, this.tooltip);

    this.renderer.addClass(this.tooltip, 'ng-tooltip');
    this.renderer.addClass(this.tooltip, `ng-tooltip-top`);

    this.setPosition();
    this.renderer.addClass(this.tooltip, 'ng-tooltip-show');
  }

  hideTooltip() {
    console.log('hide');
    this.renderer.removeChild(document.body, this.tooltip);
    this.tooltip = null;
  }

  setPosition() {
    const hostPos = this.el.nativeElement.getBoundingClientRect();

    const tooltipPos = this.tooltip.getBoundingClientRect();

    const scrollPos =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    let top, left;

    if (this.placement === 'top') {
      top = hostPos.top - tooltipPos.height - this.offset;
      left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
    }

    this.renderer.setStyle(this.tooltip, 'top', `${top + scrollPos}px`);
    this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
  }
}
