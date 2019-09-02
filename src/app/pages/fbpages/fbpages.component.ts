import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService, NbMediaBreakpoint, NbMediaBreakpointsService, NbSpinnerService } from '@nebular/theme';
import { Http } from '@angular/http';
import { FbPagesService } from '../../@core/data/fbpages.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import config from "../../config/config.json";
import { ActivatedRoute, Router } from '@angular/router';

declare let window: any;
declare let FB: any;
declare let mixpanel: any;
declare let ga: any;

@Component({
  selector: 'ngx-fbpages',
  styleUrls: ['./fbpages.component.scss'],
  templateUrl: './fbpages.component.html',
})
export class FbPagesComponent implements OnInit, OnDestroy {

  fbpages: any;
  recent: any[];
  breakpoint: NbMediaBreakpoint;
  breakpoints: any;
  themeSubscription: any;
  templateId: string;

  constructor(private themeService: NbThemeService,
    private breakpointService: NbMediaBreakpointsService,
    private fbPagesService: FbPagesService,
    private http: Http, private route: ActivatedRoute,
    private spinnerService: NbSpinnerService, private router: Router) {

    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeSubscription = this.themeService.onMediaQueryChange()
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });

    this.templateId = this.route.snapshot.queryParams.template_id;

    // if(!this.templateId){
    //   window.location.replace("https://botsoft.ai/#botsoft-menu-all");
    // }
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
        let uid = response.authResponse.userID;
        let accessToken = response.authResponse.accessToken;

        that.http.get(config.url + '/pages?access_token=' + accessToken)
          .map(response => response.json()).subscribe(res => {

            if (res.filter) {
              that.fbpages = res.filter((element, index, array) => {
                if (that.templateId) {
                  return !element.hasBotInstalled;
                }
                else {
                  return element.hasBotInstalled;
                }
              });
            }

          }
          );
        ga("send", "pageview", "/admin/fbpages-loaded");


      } else if (response.status === "not_authorized") {
        // the user is logged in to Facebook,
        // but has not authenticated your app
        that.router.navigate(['/auth'], { queryParams: that.route.snapshot.queryParams });

      } else {
        // the user isn't logged in to Facebook.
        that.router.navigate(['/auth'], { queryParams: that.route.snapshot.queryParams });
      }
    });
  }

  setup(pageId, pageName, pageAccessToken) {

    this.spinnerService.registerLoader(new Promise((resolve, reject) => {

      let endpoint = config.url + '/setup';

      if (this.templateId) {
        endpoint += '?template_id=' + this.templateId;
      }

      FB.api("/me", (response) => {
        this.http.post(endpoint, {
          page_id: pageId,
          access_token: pageAccessToken,
          user_id: response.id,
          name: pageName
        }).subscribe(
          res => {
            debugger;
            resolve();
            mixpanel.track("successfully created");
            mixpanel.track("successfully created " + this.templateId);
            window.location.replace("http://localhost:4000/#get-started?name=&code=");
          },
          err => {
            reject();
          }
        );
      });
    }));

    this.spinnerService.load();
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }

}