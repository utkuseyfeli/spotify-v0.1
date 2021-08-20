import { Component, OnInit, OnChanges } from '@angular/core';
import { RespObject } from '../response';
import { SpotifyService } from '../spotify.service';
import { SpotifyUser } from '../user';
import { PlayList } from '../playlist';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit, OnChanges {

  respObject?: RespObject;
  user?: SpotifyUser;
  playlists?: PlayList[];

  constructor(private spotify: SpotifyService) { }

  ngOnInit(): void {
    console.log("ngoninit");
    this.isAuthenticated();
  }

  ngOnChanges(){}

  authenticate(client_id: string, client_secret: string){
    this.spotify.authenticate(client_id, client_secret);
  }

  refreshTokens(){
    this.spotify.refreshAccesToken();
  }

  getUser(){
    this.spotify.getUser().pipe(
      catchError(async (err) => {
        console.log("err: ", err);
        if(err.status == 401){
          await this.spotify.refreshAccesToken();
        }
        return this.spotify.getUser();
      })
    ).subscribe(
      res => {
        console.log(res);
        this.user = res as SpotifyUser;
        let user = this.user;
        console.log('User country, id, name: ' + user.country + ' ' + user.id + ' ' + user.display_name);
      }
    );
    
  }

  fetchAccessToken(){
    if(window.location.search.length > 0){
      
      let needed: string;
      const code = window.location.search;

      if(code.length > 0){
        const urlParams = new URLSearchParams(code);
        needed = urlParams.get('code')!; // ! is the non-null assertion operator
        console.log("needed is " + needed);

        this.spotify.fetchAccessToken(needed);
      }
      
    }
  }

  getCurrentUserPlaylists(){
    this.spotify.getCurrentUserPlayLists().subscribe(
      res => {

        console.log(res);
        console.log(res.items);
        this.playlists = res.items;
        // let playlists: PlayList[] = res.items as PlayList;
        // this.playlists = playlists;
      }
    );
  }

  isAuthenticated(){
    console.log("is auth");
    let url = "https://api.spotify.com/v1/users/" + "fnpx53326g03vygrg2ikesxci";
    this.spotify.get(url).subscribe();

    
  }
}
