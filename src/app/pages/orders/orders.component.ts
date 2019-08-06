import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
declare let window: any;
declare let FB: any;
import config from "../../config/config.json";

@Component({
  selector: 'ngx-categories',
  styleUrls: ['./orders.component.scss'],
  templateUrl: './orders.component.html',
})
export class OrdersComponent {
  purchases;
  constructor(private http: Http, private route: ActivatedRoute) {
    let that = this;
    let botId = this.route.parent.snapshot.params.id;
    let categoryId = this.route.parent.snapshot.queryParams.category_id;

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
          botId +
          "/purchases?access_token=" +
          accessToken;

        that.http
          .get(
          url
          )
          .map(response => response.json())
          .subscribe(res => {
            let _purchases = res;
            
            _purchases.forEach((purchase) => {
              purchase.price = 0;

              purchase.details.forEach(detail => {
                purchase.currency = detail.currency;
                purchase.price += (detail.quantity * detail.price);
              });

              purchase.price = Number((purchase.price).toFixed(2))
            });

            _purchases.sort((a, b) => {
              return b.timestamp - a.timestamp;
            });

            that.purchases = _purchases;
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

  receiveStatusUpdatedMessage($event) {
    this.purchases = this.purchases.filter((purchase)=>{
      return purchase.id != $event;
    });
  }
}
