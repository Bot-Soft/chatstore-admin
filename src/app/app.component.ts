/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { FbPagesService } from './@core/data/fbpages.service';
import config from './config/config.json';

declare let window: any;
declare let FB: any;

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(private analytics: AnalyticsService, private fbPagesService: FbPagesService) {

    FB.init({
      appId: config.fbAppId,
      autoLogAppEvents: true,
      xfbml: true,
      version: "v2.11",
    });
    FB.AppEvents.logPageView();

    FB.getLoginStatus(function (response) {
      if (response.status === "connected") {
        // the user is logged in and has authenticated your
        // app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed
        // request, and the time the access token
        // and signed request each expire
        let uid = response.authResponse.userID;
        let accessToken = response.authResponse.accessToken;

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



  ngOnInit(): void {
    this.analytics.trackPageViews();
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }
}
