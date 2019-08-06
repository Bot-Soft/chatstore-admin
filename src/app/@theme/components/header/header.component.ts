import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import config from "../../../config/config.json";

declare let window: any;
declare let FB: any;
declare let fastspring: any;

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {


  @Input() position = 'normal';

  user: any = {};
  botInfo: any;

  userMenu = [{ title: 'Log out' }];

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private userService: UserService,
    private analyticsService: AnalyticsService, private http: Http, private route: ActivatedRoute) {
  }

  ngOnInit() {

    let that = this;
    FB.getLoginStatus(function (response) {
      if (response.status === "connected") {
        // the user is logged in and has authenticated your
        // app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed
        // request, and the time the access token
        // and signed request each expire
        FB.api("/me", (response) => {
          that.user.name = response.name;
          that.user.picture = "http://graph.facebook.com/" + response.id + "/picture?type=square"
        });

        let accessToken = response.authResponse.accessToken;
        let botId = that.route.snapshot.params.id;
        that.http.get(config.url + '/bots/' + botId + '?access_token=' + accessToken)
          .map(response => response.json()).subscribe(res => {
            that.botInfo = res;

            fastspring.builder.tag("pageId", that.botInfo.id);
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

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');
    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }
}
