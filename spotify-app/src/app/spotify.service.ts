import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { toUnicode } from 'punycode';
import { asapScheduler, Observable } from 'rxjs';
import { ConditionalExpr } from '@angular/compiler';
import { RespObject } from './response';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  authUrl: string = "https://accounts.spotify.com/authorize";
  baseUrl: string = "https://accounts.spotify.com/api";
  respObject?: RespObject;
  auth = 'Basic ' + btoa(localStorage.getItem('client_id') + ":" + localStorage.getItem('client_secret'));

  httpOptions = {
    headers: new HttpHeaders(
      {'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': this.auth
      }
    ),
    observe: 'response' as 'response'
  };

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

    localStorage.setItem("client_id", client_id);
    localStorage.setItem("client_secret", client_secret);

    window.location.href = this.authUrl;
  }

  fetchAccessToken(code: string){
    let client_id = localStorage.getItem("client_id");
    let client_secret = localStorage.getItem('client_secret');

    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=http://localhost:4200/authenticate";
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;

    console.log("clientid " + client_id +  "  " + client_secret);

    this.fetchRespOpbject(body);
  }

  fetchRespOpbject(body: string){

    
    console.log(this.auth);
    console.log(body);
    
    this.httpOptions.headers.append('Authorization', this.auth);

    console.log(this.httpOptions.headers.get('Authorization'));

    this.http.post<RespObject>("https://accounts.spotify.com/api/token", body, this.httpOptions)
      .subscribe(
        res => {
          console.log(res);
          console.log(res.body);
          console.log(res.status);
          console.log(res.statusText);

          this.respObject = res.body as RespObject;
          console.log(this.respObject);

          console.log(this.respObject?.access_token);
          console.log(this.respObject?.expires_in);
          console.log(this.respObject?.token_type);
          console.log(this.respObject?.refresh_token);
          localStorage.setItem('acces_token', this.respObject.access_token);
          localStorage.setItem("refresh_token", this.respObject.refresh_token);
        }
      );
  }

  refreshAccesToken(){
    let refresh_token = localStorage.getItem('refresh_token');
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;


    console.log("refresh: " + body);
    this.fetchRespOpbject(body);
  }
}
