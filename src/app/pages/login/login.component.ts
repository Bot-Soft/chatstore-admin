import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ActivatedRoute, Router } from '@angular/router';

declare let window: any;
declare let FB: any;

@Component({
  selector: "ngx-login",
  styleUrls: ["./login.component.scss"],
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {

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
   
        // that.router.navigate(['/pages'], { queryParams: that.route.snapshot.queryParams });
        let queryParams = "?";
        for(var propertyName in that.route.snapshot.queryParams) {
          queryParams += propertyName + "=" + that.route.snapshot.queryParams[propertyName];
       }
        window.location.replace("/#/pages"+ queryParams);

      } else if (response.status === "not_authorized") {
        // the user is logged in to Facebook,
        // but has not authenticated your app



      } else {
        // the user isn't logged in to Facebook.
     
      }
    });

    FB.Event.subscribe("auth.statusChange", response => {
      if (response.status === "connected") {
        if (response.authResponse) {

          that.router.navigate(['/pages'], { queryParams: that.route.snapshot.queryParams });
          FB.api("/me", function (response) {

          });
        } else {

        }
      }
    });
  }

  ngOnInit() {
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }
}
