import { Component, OnInit, OnChanges } from '@angular/core';
import { RespObject } from '../response';
import { SpotifyService } from '../spotify.service';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit, OnChanges {

  respObject?: RespObject;

  constructor(private spotify: SpotifyService) { }

  ngOnInit(): void {
    
  }

  ngOnChanges(){}

  authenticate(client_id: string, client_secret: string){
    this.spotify.authenticate(client_id, client_secret);
  }

  refreshTokens(){
    this.spotify.refreshAccesToken();
  }

  getUser(){
    this.spotify.getUser();
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
}
