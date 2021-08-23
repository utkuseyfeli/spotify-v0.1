///  <reference types="@types/spotify-web-playback-sdk"/>
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Track } from '../playlist';
import { SpotifyService } from '../spotify.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {

  track?: Track;
  @Input() id?: string;
  token: string = localStorage.getItem('acces_token')!;
  url?: SafeResourceUrl ;

  constructor(private spotify:SpotifyService, private route: ActivatedRoute, public sanitizer: DomSanitizer) { }

  ngOnInit(){
    this.spotify.isAuthenticatedService();
    this.getTrack();
  }

  getTrack(){

    if(!this.id){
      this.id = this.route.snapshot.paramMap.get('id')!;
    }

    let url = "https://api.spotify.com/v1/tracks/" + this.id;
    url += "?market=TR";

    this.spotify.get(url).pipe(
      map( data => {
        let obj = JSON.parse(JSON.stringify(data));
        obj.url = JSON.parse(JSON.stringify(data.external_urls.spotify));
        return obj;
      })
    )
    .subscribe(
      (res: Track) => {
        console.log(res.url);
        this.track = res;

        console.log("inside init: ", this.track);
        let url = "https://open.spotify.com/embed/track/" + this.track.id;

        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url); // needed inorder to open songs
      }
    )
  }

  play(){
    
    
  }
}
