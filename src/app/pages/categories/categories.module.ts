import { NgModule } from '@angular/core';
import { AngularEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../@theme/theme.module';
import { CategoriesComponent } from './categories.component';
import { CategoriesCardComponent } from './card/card.component';
import { ModalComponent } from './modal/modal.component';


@NgModule({
  imports: [
    ThemeModule,
    AngularEchartsModule,
  ],
  declarations: [
    CategoriesComponent,
    CategoriesCardComponent,
    ModalComponent
  ],
  entryComponents: [
    ModalComponent,
  ],
})
export class CategoriesModule { }
