import { AfterViewInit, Component, Input, OnDestroy, EventEmitter, Output, ViewChild } from "@angular/core";
import { NbThemeService } from "@nebular/theme";
import { Http } from "@angular/http";
import { ActivatedRoute } from "@angular/router";
declare let window: any;
declare let FB: any;
declare const echarts: any;
import config from "../../../config/config.json";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent } from "../modal/modal.component";

@Component({
  selector: "ngx-flow-card",
  styleUrls: ["./card.component.scss"],
  templateUrl: 'card.component.html',
})
export class FlowCardComponent implements AfterViewInit, OnDestroy {

  @Input() title: any;
  @Input() steps: any;
  @Output() messageEvent = new EventEmitter<string>();
  @Output() titleChangedEvent = new EventEmitter<string>();
  @Output() moveUpBlockEvent = new EventEmitter<string>();
  @Output() moveDownBlockEvent = new EventEmitter<string>();

  private value;
  isExpanded;

  option: any = {};
  themeSubscription: any;
  botId;
  accessToken;

  constructor(private theme: NbThemeService, private http: Http, private route: ActivatedRoute, private modalService: NgbModal) {
    let that = this;
    this.botId = this.route.parent.snapshot.params.id;

    // this.editorOptions.mode = 'code'; //set only one mode

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

  getNumberOfRows(step) {
    let stepStr = JSON.stringify(step);
    let count1 = (stepStr.match(/:/g) || []).length;
    let count2 = (stepStr.match(/{/g) || []).length;

    return count1 + count2 + 1;
  }

  updateStep(idx, $event) {
    this.steps[idx] = JSON.parse($event);
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

  moveUp(index) {
    if (index == 0) {
      return;
    }
    let currentStep = this.steps[index];
    this.steps[index] = this.steps[index - 1];
    this.steps[index - 1] = currentStep;
  }

  moveDown(index) {
    if (index == this.steps.length - 1) {
      return;
    }
    let currentStep = this.steps[index];
    this.steps[index] = this.steps[index + 1];
    this.steps[index + 1] = currentStep;
  }

  add() {
    const activeModal = this.modalService.open(ModalComponent, {
      size: 'lg',
      backdrop: 'static',
      container: 'nb-layout',
    });

    let that = this;

    activeModal.componentInstance.addStep = function (stepType) {
      switch (stepType) {
        case 'text': {
          let message = { "text": "Yor text here." };
          that.steps.push(message);
          break;
        }
        case 'qr-text': {
          let message = {
            "quick_replies": [
              {
                "content_type": "text",
                "title": "<BUTTON_TEXT>",
                "image_url": "http://example.com/img/red.png",
                "payload": "<DEVELOPER_DEFINED_PAYLOAD>"
              }
            ], "text": "Yor text here."
          };
          that.steps.push(message);
          break;
        }
        case 'qr-localtion': {
          let message = {
            "quick_replies": [
              {
                "content_type": "location"
              }
            ],
            "text": "Yor text here."
          };
          that.steps.push(message);
          break;
        }
        case 'qr-phonenumber': {
          let message = {
            "quick_replies": [
              {
                "content_type": "user_phone_number"
              }
            ],
            "text": "Yor text here."
          };
          that.steps.push(message);
          break;
        }
        case 'qr-email': {
          let message = {
            "quick_replies": [
              {
                "content_type":"user_email"
              }
            ],
            "text": "Yor text here."
          };
          that.steps.push(message);
          break;
        }
        default: {
          that.steps.push({});
        }
      }

    }
  }

  deleteStep(index) {
    this.steps.splice(index, 1)
  }

  deleteBlock() {
    this.messageEvent.emit();
  }

  titleChanged($event){
    this.title = $event;
    this.titleChangedEvent.emit($event);
  }

  moveUpBlock(){
    this.moveUpBlockEvent.emit();
  }

  moveDownBlock(){
    this.moveDownBlockEvent.emit();
  }

  // delete() {

  //   if (confirm("Are you sure you want to delete this category?")) {
  //     this.http
  //       .delete(
  //       config.url + "/bots/" +
  //       this.botId +
  //       "/categories?id=" + this.category_id + "&access_token=" +
  //       this.accessToken
  //       )
  //       .map(response => response.json())
  //       .subscribe(res => {
  //         this.messageEvent.emit(this.category_id)
  //       });
  //   } else {
  //     // Do nothing!
  //   }

  // }

  ngAfterViewInit() {
    // this.value = Math.floor((this.segment / this.total) * 100);
    // this.themeSubscription = this.theme.getJsTheme().delay(1).subscribe(config => {
    //   const solarTheme: any = config.variables.solar;
    //   this.option = Object.assign({}, {
    //     tooltip: {
    //       trigger: 'item',
    //       formatter: '{a} <br/>{b} : {c} ({d}%)',
    //     },
    //     series: [
    //       {
    //         name: ' ',
    //         clockWise: true,
    //         hoverAnimation: false,
    //         type: 'pie',
    //         center: ['45%', '50%'],
    //         radius: solarTheme.radius,
    //         data: [
    //           {
    //             value: this.value,
    //             name: ' ',
    //             label: {
    //               normal: {
    //                 position: 'center',
    //                 formatter: '{d}%',
    //                 textStyle: {
    //                   fontSize: '22',
    //                   fontFamily: config.variables.fontSecondary,
    //                   fontWeight: '600',
    //                   color: config.variables.fgHeading,
    //                 },
    //               },
    //             },
    //             tooltip: {
    //               show: false,
    //             },
    //             itemStyle: {
    //               normal: {
    //                 color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    //                   {
    //                     offset: 0,
    //                     color: solarTheme.gradientLeft,
    //                   },
    //                   {
    //                     offset: 1,
    //                     color: solarTheme.gradientRight,
    //                   },
    //                 ]),
    //                 shadowColor: solarTheme.shadowColor,
    //                 shadowBlur: 0,
    //                 shadowOffsetX: 0,
    //                 shadowOffsetY: 3,
    //               },
    //             },
    //             hoverAnimation: false,
    //           },
    //           {
    //             value: 100 - this.value,
    //             name: ' ',
    //             tooltip: {
    //               show: false,
    //             },
    //             label: {
    //               normal: {
    //                 position: 'inner',
    //               },
    //             },
    //             itemStyle: {
    //               normal: {
    //                 color: config.variables.layoutBg,
    //               },
    //             },
    //           },
    //         ],
    //       },
    //       {
    //         name: ' ',
    //         clockWise: true,
    //         hoverAnimation: false,
    //         type: 'pie',
    //         center: ['45%', '50%'],
    //         radius: solarTheme.radius,
    //         data: [
    //           {
    //             value: this.value,
    //             name: ' ',
    //             label: {
    //               normal: {
    //                 position: 'inner',
    //                 show: false,
    //               },
    //             },
    //             tooltip: {
    //               show: false,
    //             },
    //             itemStyle: {
    //               normal: {
    //                 color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    //                   {
    //                     offset: 0,
    //                     color: solarTheme.gradientLeft,
    //                   },
    //                   {
    //                     offset: 1,
    //                     color: solarTheme.gradientRight,
    //                   },
    //                 ]),
    //                 shadowColor: solarTheme.shadowColor,
    //                 shadowBlur: 7,
    //               },
    //             },
    //             hoverAnimation: false,
    //           },
    //           {
    //             value: 100,
    //             name: ' ',
    //             tooltip: {
    //               show: false,
    //             },
    //             label: {
    //               normal: {
    //                 position: 'inner',
    //               },
    //             },
    //             itemStyle: {
    //               normal: {
    //                 color: 'none',
    //               },
    //             },
    //           },
    //         ],
    //       },
    //     ],
    //   });
    // });
  }

  ngOnDestroy() {
    // this.themeSubscription.unsubscribe();
  }
}
