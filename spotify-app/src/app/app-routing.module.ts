import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtistComponent } from './artist/artist.component';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { SearchComponent } from './search/search.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {path:"authenticate" , component: AuthenticateComponent},
  {path:"search", component: SearchComponent},
  {path: "user/:id", component:UserComponent},
  {path: "artist/:id", component:ArtistComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
