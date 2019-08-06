import { NgModule } from '@angular/core';
import { AngularEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../@theme/theme.module';
import { PeopleComponent } from './people.component';
import { PeopleCardComponent } from './card/card.component';


@NgModule({
  imports: [
    ThemeModule,
    AngularEchartsModule,
  ],
  declarations: [
    PeopleComponent,
    PeopleCardComponent,
  ],
})
export class PeopleModule { }
