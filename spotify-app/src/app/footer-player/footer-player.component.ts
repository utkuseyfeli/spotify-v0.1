import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-footer-player',
  templateUrl: './footer-player.component.html',
  styleUrls: ['./footer-player.component.css']
})
export class FooterPlayerComponent implements OnInit {

  constructor(private spotify: SpotifyService) { }

  ngOnInit(): void {
  }

  stop(){
    this.spotify.put("https://api.spotify.com/v1/me/player/pause").subscribe(
      res => {
        console.log(res);
      }
    );
  }

}
