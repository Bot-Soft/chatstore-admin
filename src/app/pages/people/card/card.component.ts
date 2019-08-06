import { Component, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

declare const echarts: any;

@Component({
  selector: 'ngx-people-card',
  styleUrls: ['./card.component.scss'],
  template: `
  <nb-card>
    <div class="icon-container" style="padding: 10px;">
        <nb-user picture="{{avatar}}" name="{{name}}" size="large" title="{{gender}}"></nb-user>
    </div>
    <nb-card-footer>
    <nb-actions size="xsmall" fullWidth>
      <nb-action>
        <a href="#"><i class="ion-ios-chatboxes-outline" style="font-size: 25px;" title="Message"></i></a>
      </nb-action>
      <nb-action>
        <a href="#"><i class="ion-ios-information-outline" style="font-size: 25px;" title="Info"></i></a>
      </nb-action>
    </nb-actions>
  </nb-card-footer>
  </nb-card>
  `,
})
export class PeopleCardComponent {

  @Input() avatar: string;
  @Input() name: string;
  @Input() gender: string;

  private value;

  option: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
  }
}
