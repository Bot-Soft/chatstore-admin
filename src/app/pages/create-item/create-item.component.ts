import { Component, OnDestroy, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/observable/of';
import { ActivatedRoute } from '@angular/router';
import config from "../../config/config.json";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent } from "./modal/modal.component";

declare let window: any;
declare let FB: any;

@Component({
  selector: 'ngx-create-item',
  styleUrls: ['./create-item.component.scss'],
  templateUrl: './create-item.component.html',
})
export class CreateItemComponent {
  botId;
  item = {
    subtitle: "",
    title: "",
    order: "",
    image_url: "",
    id: "",
    buttons: [],
    default_action: {
      type: "web_url",
      url: "",
      messenger_extensions: true,
      webview_height_ratio: "full"
    }
  };
  gotoblocks = [];
  parents = [];
  selectedParent = {};
  parent_id;
  item_id;
  buttonType: string;
  accessToken;
  constructor(private http: Http, private route: ActivatedRoute, private modalService: NgbModal) {
    let that = this;
    this.botId = this.route.parent.snapshot.params.id;
    this.parent_id = this.route.snapshot.queryParams.parent_id;
    this.item_id = this.route.snapshot.queryParams.id;
    this.accessToken;

    FB.getLoginStatus(function (response) {
      if (response.status === "connected") {
        // the user is logged in and has authenticated your
        // app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed
        // request, and the time the access token
        // and signed request each expire
        let uid = response.authResponse.userID;
        that.accessToken = response.authResponse.accessToken;

        // that.http
        //   .get(
        //     config.url + "/bots/" +
        //     that.botId +
        //     "/items?access_token=" +
        //     that.accessToken
        //   )
        //   .map(response => response.json())
        //   .subscribe(res => {
        //     that.parents = res;
        //     if (that.parent_id) {
        //       that.parents = that.parents.map((parent) => {
        //         if (parent.id == that.parent_id) {
        //           that.selectedParent = parent.id;
        //         }
        //         return parent;
        //       });
        //     } else {
        //       if (that.parents.length > 0) {
        //         that.selectedParent = that.parents[0].id;
        //       }
        //     }
        //   });

        // that.http
        //   .get(
        //     config.url + "/bots/" +
        //     that.botId +
        //     "?access_token=" +
        //     that.accessToken
        //   )
        //   .map(response => response.json())
        //   .subscribe(res => {
        //     that.gotoblocks = res.blocks.template.goto;

        //   });

        if (that.item_id) {
          that.http
            .get(
              config.url + "/bots/" +
              that.botId +
              "/items/" + that.item_id + "?access_token=" +
              that.accessToken
            )
            .map(response => response.json())
            .subscribe(res => {

              that.item = res;

              if (!that.item.buttons) {
                that.item.buttons = [{ type: "", payload: "", url: "" }];
              }

            });
        }
      } else if (response.status === "not_authorized") {
        // the user is logged in to Facebook,
        // but has not authenticated your app
        window.location.replace("/#/auth");
      } else {
        // the user isn't logged in to Facebook.
        window.location.replace("/#/auth");
      }
    });
  }

  openButtonModal(curButton = {}) {
    const activeModal = this.modalService.open(ModalComponent, {
      size: 'lg',
      backdrop: 'static',
      container: 'nb-layout',
    });

    let that = this;

    activeModal.componentInstance.button = curButton;
    if (!curButton["type"]) {

      activeModal.componentInstance.action = "Create Button";
      activeModal.componentInstance.saveButtonName = "Create";
    }
    else {
      activeModal.componentInstance.action = "Edit Button";
      activeModal.componentInstance.saveButtonName = "Save";
    }

    activeModal.componentInstance.addButtonRef = function (button) {

      if (activeModal.componentInstance.action == "Create Button") {
        that.item.buttons.push(button);
      }
      else {
        let updateIndex = that.item.buttons.indexOf(curButton);
        if (updateIndex > -1) {
          that.item.buttons[updateIndex] = {};
          that.item.buttons[updateIndex] = button;
        }
      }

    };
  }

  deleteButton(button) {
    let deleteElementIdx = this.item.buttons.indexOf(button);
    if (deleteElementIdx > -1) {
      this.item.buttons.splice(deleteElementIdx, 1);
    }
  }

  addButton() {
    if (this.item.buttons.length < 3) {
      this.openButtonModal();
    }
  }

  moveButtonUp(index) {
    if (index == 0) {
      return;
    }
    let currentButton = this.item.buttons[index];
    this.item.buttons[index] = this.item.buttons[index - 1];
    this.item.buttons[index - 1] = currentButton;
  }

  moveButtonDown(index) {
    if (index == this.item.buttons.length - 1) {
      return;
    }
    let currentButton = this.item.buttons[index];
    this.item.buttons[index] = this.item.buttons[index + 1];
    this.item.buttons[index + 1] = currentButton;
  }

  removeButton(index) {
    if (this.item.buttons.length > 1) {
      this.item.buttons.splice(index, 1);
    } else {
      let keys = Object.keys(this.item.buttons[index]);
      keys.forEach((key) => {
        if (key != "type") {
          this.item.buttons[index][key] = "";
        }
      });
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

  save() {

    this.parent_id = this.selectedParent;

    if (!this.item["title"]) {
      alert("Title is required.");
      return;
    }

    if (!this.item["subtitle"]) {
      alert("Subtitle is required.");
      return;
    }

    if (!this.item["image_url"]) {
      alert("Image URL is required.");
      return;
    }

    let errorFlag = false;
    if (this.item.buttons) {

      this.item.buttons.forEach((button) => {
        let keys = Object.keys(button);
        keys.forEach((key) => {
          if (!button[key]) {
            delete button[key];
          }
        });
      });
    }

    if (!errorFlag) {
      this.http
        .post(
          config.url + "/bots/" +
          this.botId +
          "/items?access_token=" +
          this.accessToken,
          this.item
        )
        .map(response => response.json())
        .subscribe(res => {
          let navigateToUrl = "#/bot/" + this.botId + "/items";
          window.location.replace(navigateToUrl);

        });
    }
  }
}