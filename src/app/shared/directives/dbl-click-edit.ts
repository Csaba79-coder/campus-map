import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDblClickEdit]',
  standalone: true,
})
export class DblClickEdit {
  @Output() appDblClickEdit = new EventEmitter<void>();

  @HostListener('dblclick')
  onDoubleClick(): void {
    this.appDblClickEdit.emit();
  }
}
