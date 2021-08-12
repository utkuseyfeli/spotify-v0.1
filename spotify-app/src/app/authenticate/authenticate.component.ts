import { Component, OnInit, OnChanges } from '@angular/core';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit, OnChanges {

  constructor(private spotify: SpotifyService) { }

  ngOnInit(): void {
    if(window.location.search.length > 0){
      console.log("utkuuuuu succes on the first part");
      
      let needed = null;
      const code = window.location.search;
      console.log(code);

      if(code.length > 0){
        const urlParams = new URLSearchParams(code);
        needed = urlParams.get('code');
      }
      console.log("needed is " + needed);
    }
  }

  ngOnChanges(){}

  authenticate(client_id: string, client_secret: string){
    this.spotify.authenticate(client_id, client_secret);
  }

}
