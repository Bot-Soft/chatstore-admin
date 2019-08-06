import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { CategoriesComponent } from './categories/categories.component';
import { FlowComponent } from './flow/flow.component';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { MessagesComponent } from './messages/messages.component';
import { ImagesComponent } from './images/images.component';
import { ItemsComponent } from './items/items.component';
import { CreateItemComponent } from './create-item/create-item.component';
import { PeopleComponent } from './people/people.component';
import { SettingsComponent } from './settings/settings.component';
import { OrdersComponent } from './orders/orders.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [{
    path: 'categories',
    component: CategoriesComponent,
  }, {
    path: 'category',
    component: CreateCategoryComponent,
  }, {
    path: 'item',
    component: CreateItemComponent,
  }, {
    path: 'items',
    component: ItemsComponent,
  }, {
    path: 'messages',
    component: MessagesComponent,
  }, {
    path: 'orders',
    component: OrdersComponent,
  }, {
    path: 'images',
    component: ImagesComponent,
  }, {
    path: 'people',
    component: PeopleComponent,
  }, {
    path: 'flow',
    component: FlowComponent,
  }, {
    path: 'settings',
    component: SettingsComponent,
  }, {
    path: '',
    redirectTo: 'settings',
    pathMatch: 'full',
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
