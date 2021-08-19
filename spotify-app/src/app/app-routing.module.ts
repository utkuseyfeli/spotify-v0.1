import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumComponent } from './album/album.component';
import { ArtistComponent } from './artist/artist.component';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { SearchComponent } from './search/search.component';
import { TrackComponent } from './track/track.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {path:"authenticate" , component: AuthenticateComponent},
  {path:"search", component: SearchComponent},
  {path: "user/:id", component:UserComponent},
  {path: "artist/:id", component:ArtistComponent},
  {path: "track/:id", component:TrackComponent},
  {path: "album/:id", component:AlbumComponent},
  {path: "playlist/:id", component:PlaylistComponent},
  {path: "", redirectTo: "/authenticate", pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
