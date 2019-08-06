import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngx-modal',
  templateUrl: 'modal.component.html',
  styleUrls: ["./modal.component.scss"],
})
export class ModalComponent {

  addButtonRef: any;
  button: any;
  action: String;
  saveButtonName: String;

  constructor(private activeModal: NgbActiveModal) {

  }

  closeModal() {
    this.activeModal.close();
  }
  addButton() {
    this.addButtonRef(this.button);
    if(this.validate()){
      this.activeModal.close();
    }
  }

  onChangeButtonType(type) {
    this.button.type = type;
    this.button.payload = '';
    this.button.url = '';
  }

  validate(){
    if(this.button.url && !this.isValidURL(this.button.url)){
      alert("Error");
      return false;
    }

    return true;
  }

  isValidURL(str) {
    let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str)) {
      return true;
    }
    else {
      return false;
    }
  }

  getButtonTypeDisplayValue(button) {

    switch (button.type) {
      case 'web_url': {
        return 'URL';
      }
      case 'phone_number': {
        return 'Phone Call'
      }
      case 'postback': {
        return 'Go To';
      }
      case 'element_share': {
        return 'Share';
      }
    }
  }

}