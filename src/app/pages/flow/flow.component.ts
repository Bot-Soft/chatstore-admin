import { Component } from "@angular/core";
import { Http } from "@angular/http";
import { ActivatedRoute } from "@angular/router";
import config from "../../config/config.json";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent } from "./modal/modal.component";
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
declare let window: any;
declare let FB: any;

@Component({
  selector: "ngx-flow",
  styleUrls: ["./flow.component.scss"],
  templateUrl: "./flow.component.html"
})
export class FlowComponent {
  blocks;
  botId;
  accessToken;
  isInitial;
  constructor(private http: Http, private route: ActivatedRoute, private modalService: NgbModal) {
    let that = this;
    this.botId = this.route.parent.snapshot.params.id;
    this.isInitial = this.route.parent.snapshot.queryParams.initial;

    FB.getLoginStatus(function (response) {
      if (response.status === "connected") {
        // the user is logged in and has authenticated your
        // app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed
        // request, and the time the access token
        // and signed request each expire
        let uid = response.authResponse.userID;
        that.accessToken = response.authResponse.accessToken;

        let botId = that.route.parent.snapshot.params.id;

        that.http.get(config.url + '/bots/' + botId + '?access_token=' + that.accessToken)
          .map(response => response.json()).subscribe(res => {

            let flow = res.blocks.template.flow;

            that.blocks = flow;
          }
          );
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

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  add() {
    this.blocks.push({ title: "Untitled", steps: [] });
  }

  receiveDeleteMessage(index) {
    this.blocks.splice(index, 1);
  }

  save() {

    this.http
      .post(
        config.url + "/bots/" +
        this.botId +
        "/flow?access_token=" +
        this.accessToken,
        this.blocks
      )
      .map(response => response.json())
      .subscribe(res => {
        let notificationText = "Saved Successfully";
        if(res != "OK"){
          notificationText = res;
        }
        var x = document.getElementById("snackbar")
        x.className = "show";
        x.textContent = notificationText;
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
      });
  }

  titleChanged(idx, $event) {
    this.blocks[idx].title = $event;
  }

  moveUpBlock(index) {
    if (index == 0) {
      return;
    }
    let currentBlock = this.blocks[index];
    this.blocks[index] = this.blocks[index - 1];
    this.blocks[index - 1] = currentBlock;
  }

  moveDownBlock(index) {
    if (index == this.blocks.length - 1) {
      return;
    }
    let currentBlock = this.blocks[index];
    this.blocks[index] = this.blocks[index + 1];
    this.blocks[index + 1] = currentBlock;
  }
}
