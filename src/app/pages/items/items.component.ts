import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
declare let window: any;
declare let FB: any;
import config from "../../config/config.json";

@Component({
  selector: 'ngx-categories',
  styleUrls: ['./items.component.scss'],
  templateUrl: './items.component.html',
})
export class ItemsComponent {
  items;
  botId;
  parentId;
  constructor(private http: Http, private route: ActivatedRoute) {
    let that = this;
    this.botId = this.route.parent.snapshot.params.id;
    this.parentId = this.route.parent.snapshot.queryParams.parent_id;

    FB.getLoginStatus(function (response) {
      if (response.status === "connected") {
        // the user is logged in and has authenticated your
        // app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed
        // request, and the time the access token
        // and signed request each expire
        let uid = response.authResponse.userID;
        let accessToken = response.authResponse.accessToken;

        let url = config.url + "/bots/" +
          that.botId +
          "/items?access_token=" +
          accessToken;

        if (that.parentId) {
          url += "&parent_id=" + that.parentId;
        }
        that.http
          .get(
            url
          )
          .map(response => response.json())
          .subscribe(res => {
            let _items = res;

            that.items = _items.sort((a, b) => {
              return b.timestamp - a.timestamp;
            });
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
    this.items = this.items.filter((item) => {
      return item.id != $event;
    });
  }

  create() {
    // debugger;
    // if(this.items.length < 10){
      window.location.replace("/#/bot/" + this.botId + "/item" + (this.parentId ? ("?parent_id=" + this.parentId):""));
    // }
    // else {
    //   var x = document.getElementById("snackbar")
    //   x.className = "show";
    //   x.textContent = "The MAX number of items is reached";
    //   setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    // }
  }
}
