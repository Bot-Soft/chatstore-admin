import { Component, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
declare let window: any;
declare let FB: any;
import config from "../../../config/config.json";

@Component({
  selector: 'ngx-items-card',
  styleUrls: ['./card.component.scss'],
  templateUrl: './card.component.html',
})
export class ItemsCardComponent {

  @Input() image: string;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() parent_id: any;
  @Input() item_id: any;

  @Output() messageEvent = new EventEmitter<string>();

  currentTheme: string;
  themeSubscription: any;
  botId;
  accessToken;

  constructor(private themeService: NbThemeService, private http: Http, private route: ActivatedRoute) {
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

  delete() {

    if (confirm("Are you sure you want to delete this item?")) {
      this.http
        .delete(
        config.url + "/bots/" +
        this.botId +
        "/item?id=" + this.item_id + "&access_token=" +
        this.accessToken
        )
        .map(response => response.json())
        .subscribe(res => {
          this.messageEvent.emit(this.item_id)
        });
    } else {
      // Do nothing!
    }

  }

}
