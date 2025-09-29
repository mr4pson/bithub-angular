import { Component } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent {
  tooltipTitle = 'Description';
  tooltipText =
    'A transmission is a machine in a transmission system, which provides controlled application of the power. A transmission is a machine in a transmission system, which provides controlled application of the power.';
  data =
    'A transmission is a machine in a transmission system, which provides controlled application of the power...';
}
