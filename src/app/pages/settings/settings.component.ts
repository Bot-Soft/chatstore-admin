import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService, NbMediaBreakpoint, NbMediaBreakpointsService, NbSpinnerService } from '@nebular/theme';
import { Http } from '@angular/http';
import { FbPagesService } from '../../@core/data/fbpages.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { ActivatedRoute } from '@angular/router';
import config from "../../config/config.json";

declare let window: any;
declare let FB: any;

@Component({
  selector: 'ngx-settings',
  styleUrls: ['./settings.component.scss'],
  templateUrl: './settings.component.html',
})
export class SettingsComponent {

  textFields;
  accessToken;
  botId;
  name;
  secret;
  updatedTextFields = {};
  constructor(private http: Http, private route: ActivatedRoute, private spinnerService: NbSpinnerService) {
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

        that.http
          .get(
            config.url + "/bots/" +
            that.botId +
            "?access_token=" +
            that.accessToken
          )
          .map(response => response.json())
          .subscribe(res => {
            let allDataFields = [];
            that.name = res.name;
            that.secret = res.secret;
            let dataFields = res.blocks.data;
            for (var key in dataFields) {
              if (dataFields.hasOwnProperty(key)) {
                dataFields[key].name = key;
                allDataFields.push(dataFields[key]);
              }
            }
            let editableDataFields = [];
            allDataFields.forEach(dataField => {

              // Get all editable fields for Messages area
              if (dataField.editable && dataField.area == "settings") {
                editableDataFields.push(dataField);
              }
            });

            editableDataFields = editableDataFields.sort((a, b) => {
              return a.order - b.order;
            });

            that.textFields = editableDataFields;
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

  save() {
    this.http
      .post(
        config.url + "/bots/" +
        this.botId +
        "/data?access_token=" +
        this.accessToken,
        this.updatedTextFields
      )
      .map(response => response.json())
      .subscribe(res => {
        var x = document.getElementById("snackbar")
        x.className = "show";
        x.textContent = "Saved Successfully";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);

      });
  }

  delete() {
    if (confirm("Are you sure you want to delete your chatbot?")) {

      this.spinnerService.registerLoader(new Promise((resolve, reject) => {
        this.http
          .delete(
            config.url + "/bots/" +
            this.botId +
            "?access_token=" +
            this.accessToken)
          .map(response => response.json())
          .subscribe(res => {
            resolve();
            var x = document.getElementById("snackbar")
            x.className = "show";
            x.textContent = "Bot Deleted Successfully";
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
            window.location.replace("/#/auth");
          });
      }));
    } else {
      // Do nothing!
    }

    this.spinnerService.load();
  }

  onModelChanged(textField, $event) {
    textField.value = $event
    this.updatedTextFields[textField.name] = textField.value;
  }
}