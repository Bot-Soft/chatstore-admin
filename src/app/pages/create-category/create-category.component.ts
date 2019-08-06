import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService, NbMediaBreakpoint, NbMediaBreakpointsService } from '@nebular/theme';
import { Http } from '@angular/http';
import { FbPagesService } from '../../@core/data/fbpages.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { ActivatedRoute } from '@angular/router';
import config from "../../config/config.json";

declare let window: any;
declare let FB: any;

@Component({
  selector: 'ngx-messages',
  styleUrls: ['./create-category.component.scss'],
  templateUrl: './create-category.component.html',
})
export class CreateCategoryComponent {
  botId;
  category = {
    button_text: "",
    title: "",
    order: "",
    image_url: "",
    subtitle: "",
    id: ""
  };
  category_id;
  accessToken;
  constructor(private http: Http, private route: ActivatedRoute) {
    let that = this;
    this.botId = this.route.parent.snapshot.params.id;
    this.category_id = this.route.snapshot.queryParams.category_id;;
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

        if (that.category_id) {
          that.http
            .get(
            config.url + "/bots/" +
            that.botId +
            "/categories?access_token=" +
            that.accessToken
            )
            .map(response => response.json())
            .subscribe(res => {
              let currentCategory = res.find((category) => {
                return category.id == that.category_id;
              });

              that.category = currentCategory;

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

  create() {
    if (!this.category["title"]) {
      alert("Category title is required.");
      return;
    }

    if (!this.category["subtitle"]) {
      alert("Category subtitle is required.");
      return;
    }

    if (!this.category["image_url"]) {
      alert("Category Image URL is required.");
      return;
    }

    this.http
      .post(
      config.url +"/bots/" +
      this.botId +
      "/categories?access_token=" +
      this.accessToken,
      this.category
      )
      .map(response => response.json())
      .subscribe(res => {
        window.location.replace("#/bot/" + this.botId + "/categories");

      });
  }
}