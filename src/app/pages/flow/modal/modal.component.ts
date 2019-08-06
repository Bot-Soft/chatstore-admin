import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngx-modal',
  templateUrl: 'modal.component.html',
  styleUrls: ["./modal.component.scss"],
})
export class ModalComponent {

  addStep: any;
  constructor(private activeModal: NgbActiveModal) { }

  closeModal() {
    this.activeModal.close();
  }

  create(stepType) {
    this.addStep(stepType);
    this.activeModal.close();
  }
}