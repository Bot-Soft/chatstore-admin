import { NgModule } from '@angular/core';
import { AngularEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../@theme/theme.module';
import { FlowComponent } from './flow.component';
import { FlowCardComponent } from './card/card.component';
import { ModalComponent } from './modal/modal.component';


@NgModule({
  imports: [
    ThemeModule,
    AngularEchartsModule,
  ],
  declarations: [
    FlowComponent,
    FlowCardComponent,
    ModalComponent
  ],
  entryComponents: [
    ModalComponent,
  ],
})
export class FlowModule { }
