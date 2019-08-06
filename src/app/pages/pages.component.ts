import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { Http } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
declare let window: any;
declare let FB: any;
import config from "../config/config.json";

@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-main-layout>
      <nb-menu *ngIf="menu" [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-main-layout>
  `,
})
export class PagesComponent {

  // menu = MENU_ITEMS;
  menu;

  constructor(private http: Http, private route: ActivatedRoute, private router: Router) {

    let that = this;


    FB.getLoginStatus(function (response) {
      if (response.status === "connected") {
        // the user is logged in and has authenticated your
        // app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed
        // request, and the time the access token
        // and signed request each expire
        let uid = response.authResponse.userID;
        let accessToken = response.authResponse.accessToken;

        let botId = that.route.snapshot.params.id;

        that.http.get(config.url + '/bots/' + botId + '?access_token=' + accessToken)
          .map(response => response.json()).subscribe(res => {
            let menuItems = [];

            if (!res.blocks) {
              that.router.navigate(['/auth'], { queryParams: that.route.snapshot.queryParams });
              return;
            }

            if (res.blocks.template.areas) {
              res.blocks.template.areas.forEach(element => {
                menuItems.push(element);
              });

              menuItems.sort((a, b) => {
                return a.order - b.order;
              });

              that.menu = menuItems;
            }
          }
          );

      } else if (response.status === "not_authorized") {
        // the user is logged in to Facebook,
        // but has not authenticated your app
        window.location.replace("/#/auth");
        that.router.navigate(['/auth'], { queryParams: that.route.snapshot.queryParams });

      } else {
        // the user isn't logged in to Facebook.
        that.router.navigate(['/auth'], { queryParams: that.route.snapshot.queryParams });
      }
    });
  }
}
