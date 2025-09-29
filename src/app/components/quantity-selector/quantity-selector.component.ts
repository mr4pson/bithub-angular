import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-quantity-selector',
  templateUrl: 'quantity-selector.component.html',
  styleUrls: ['quantity-selector.component.scss'],
})
export class CQuantitySelectorComponent {
  @Input() public quantity: number = 0;
  @Input() public step: number = 0;
  @Output() private change: EventEmitter<number> = new EventEmitter();
  @Output() private remove: EventEmitter<void> = new EventEmitter();

  handleIncrement() {
    this.quantity += this.step;

    this.change.emit(this.quantity);
  }

  handleDecrement() {
    if (this.quantity > this.step) {
      this.quantity -= this.step;
      this.change.emit(this.quantity);

      return;
    }

    this.remove.emit();
  }
}
