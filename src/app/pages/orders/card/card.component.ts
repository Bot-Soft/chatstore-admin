import { Component, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
declare let window: any;
declare let FB: any;
import config from "../../../config/config.json";

@Component({
  selector: 'ngx-orders-card',
  styleUrls: ['./card.component.scss'],
  templateUrl: './card.component.html',
})
export class OrdersCardComponent {

  @Input() image: string;
  @Input() title: string;
  @Input() details: any[];
  @Input() price: string;
  @Input() avatar: string;
  @Input() name: string;
  @Input() purchase_id: string;

  @Output() messageEvent = new EventEmitter<string>();

  currentTheme: string;
  themeSubscription: any;
  botId;
  accessToken;

  constructor(private theme: NbThemeService, private http: Http, private route: ActivatedRoute) {
    let that = this;
    this.botId = this.route.parent.snapshot.params.id;

    FB.getLoginStatus(function (response) {
      if (response.status === "connected") {
        // the user is logged in and has authenticated your
        // app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed
        // request, and the time the access token
        // and signed request each expire
        let uid = response.authResponse.userID;
        that.accessToken = response.authResponse.accessToken;

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

  setStatus(status) {
    if (confirm("Are you ready with this order?")) {
      this.http
        .post(
        config.url + "/bots/" +
        this.botId +
        "/purchases?access_token=" +
        this.accessToken,
        {
          status: status,
          purchase_id: this.purchase_id 
        }
        )
        .map(response => response.json())
        .subscribe(res => {
          this.messageEvent.emit(this.purchase_id)
        });
    } else {
      // Do nothing!
    }
  }
}
