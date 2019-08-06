import { NgModule } from '@angular/core';
import { AngularEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../@theme/theme.module';
import { OrdersComponent } from './orders.component';
import { OrdersCardComponent } from './card/card.component';


@NgModule({
  imports: [
    ThemeModule,
    AngularEchartsModule,
  ],
  declarations: [
    OrdersComponent,
    OrdersCardComponent,
  ],
})
export class OrdersModule { }
