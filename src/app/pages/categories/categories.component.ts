import { Component } from "@angular/core";
import { Http } from "@angular/http";
import { ActivatedRoute } from "@angular/router";
import config from "../../config/config.json";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent } from "./modal/modal.component";
declare let window: any;
declare let FB: any;
declare let ga: any;

@Component({
  selector: "ngx-categories",
  styleUrls: ["./categories.component.scss"],
  templateUrl: "./categories.component.html"
})
export class CategoriesComponent {
  categories;
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

        that.http
          .get(
            config.url + "/bots/" +
            that.botId +
            "/categories?access_token=" +
            that.accessToken
          )
          .map(response => response.json())
          .subscribe(res => {
            let _categories = res;

            that.categories = _categories.sort((a, b) => {
              return a.order - b.order;
            });

            if (that.isInitial) {
              const activeModal = that.modalService.open(ModalComponent, {
                size: 'lg',
                backdrop: 'static',
                container: 'nb-layout',
              });
              activeModal.componentInstance.pageId = that.botId;
              ga("send", "pageview", "/admin/chatbot-created");
            }

          });
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

  receiveDeleteMessage($event) {
    this.categories = this.categories.filter((category) => {
      return category.id != $event;
    });
  }

  create() {
    if (this.categories.length < 10) {
      window.location.replace("#/bot/" + this.botId + "/category");
    }
    else {
      var x = document.getElementById("snackbar")
      x.className = "show";
      x.textContent = "The MAX number of categories is reached";
      setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }
  }
}
