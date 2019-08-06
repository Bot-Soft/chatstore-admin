import { NgModule } from '@angular/core';
import { AngularEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../@theme/theme.module';
import { CreateItemComponent } from './create-item.component';
import { ModalComponent } from './modal/modal.component';


@NgModule({
  imports: [
    ThemeModule,
    AngularEchartsModule,
  ],
  declarations: [
    CreateItemComponent,
    ModalComponent
  ],
  entryComponents: [
    ModalComponent,
  ],
})
export class CreateItemModule { }
