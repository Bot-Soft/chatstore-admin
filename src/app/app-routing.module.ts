import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './pages/login/login.component';
import { FbPagesComponent } from './pages/fbpages/fbpages.component';

const routes: Routes = [
  { path: 'bot/:id', loadChildren: 'app/pages/pages.module#PagesModule' },
  { path: 'auth', component: LoginComponent },
  { path: 'pages', component: FbPagesComponent },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' },
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
