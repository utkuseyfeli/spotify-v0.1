import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {path:"authenticate" , component: AuthenticateComponent},
  {path:"search", component: SearchComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
