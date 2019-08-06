import { NgModule } from '@angular/core';
import { AngularEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../@theme/theme.module';
import { ImagesComponent } from './images.component';


@NgModule({
  imports: [
    ThemeModule,
    AngularEchartsModule,
  ],
  declarations: [
    ImagesComponent,
  ],
})
export class ImagesModule { }
