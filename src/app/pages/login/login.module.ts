import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../@theme/theme.module';
import { LoginComponent } from './login.component';

@NgModule({
  imports: [
    RouterModule,
    ThemeModule,
    AngularEchartsModule,
  ],
  declarations: [
    LoginComponent,
  ],
})
export class LoginModule { }
