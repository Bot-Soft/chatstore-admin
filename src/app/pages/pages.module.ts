import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { LoginModule } from './login/login.module';
import { CategoriesModule } from './categories/categories.module';
import { FlowModule } from './flow/flow.module';
import { CreateCategoryModule } from './create-category/create-category.module';
import { MessagesModule } from './messages/messages.module';
import { ImagesModule } from './images/images.module';
import { ItemsModule } from './items/items.module';
import { CreateItemModule } from './create-item/create-item.module';
import { PeopleModule } from './people/people.module';
import { SettingsModule } from './settings/settings.module';
import { OrdersModule } from './orders/orders.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    LoginModule,
    PagesRoutingModule,
    ThemeModule,
    CategoriesModule,
    FlowModule,
    CreateCategoryModule,
    CreateItemModule,
    MessagesModule,
    OrdersModule,
    ImagesModule,
    SettingsModule,
    ItemsModule,
    PeopleModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class PagesModule {
}
