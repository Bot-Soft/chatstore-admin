import { NgModule } from '@angular/core';
import { AngularEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../@theme/theme.module';
import { ItemsComponent } from './items.component';
import { ItemsCardComponent } from './card/card.component';


@NgModule({
  imports: [
    ThemeModule,
    AngularEchartsModule,
  ],
  declarations: [
    ItemsComponent,
    ItemsCardComponent,
  ],
})
export class ItemsModule { }
