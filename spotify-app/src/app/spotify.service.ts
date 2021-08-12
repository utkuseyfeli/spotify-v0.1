import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { toUnicode } from 'punycode';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  authUrl: string = "https://accounts.spotify.com/authorize";

  constructor(private http: HttpClient) { }

  authenticate(client_id: string, client_secret: string){
    console.log(client_id, "   ", client_secret);
    this.authUrl += "?client_id=" + client_id;
    this.authUrl += "&response_type=code";
    this.authUrl += "&redirect_uri=http://localhost:4200/authenticate";
    this.authUrl += "&show_dialog=true";

    /** Giving all of the permissions */
    this.authUrl += "&scope=ugc-image-upload user-read-recently-played user-top-read user-read-playback-position user-read-playback-state user-modify-playback-state user-read-currently-playing ";
    this.authUrl += "app-remote-control streaming playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative user-follow-modify user-follow-read user-library-modify ";
    this.authUrl += "user-library-read user-read-email user-read-private";
    console.log(this.authUrl);

    window.location.href = this.authUrl;
  }


}
 