import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { toUnicode } from 'punycode';
import { asapScheduler, Observable, of } from 'rxjs';
import { ConditionalExpr } from '@angular/compiler';
import { PlaylistRespObject, RefreshRespObject, RespObject } from './response';
import { SpotifyUser } from './user';
import { Album, Artist, PlayList, Track } from './playlist';
import { catchError, map } from 'rxjs/operators';
import { ValueTransformer } from '@angular/compiler/src/util';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  authUrl: string = "https://accounts.spotify.com/authorize";
  baseUrl: string = "https://accounts.spotify.com/api";
  respObject?: RespObject;
  user?: SpotifyUser;
  isAuthenticated?: boolean;

  httpOptions = {
    headers: new HttpHeaders(
      {'Content-Type': 'application/x-www-form-urlencoded'
      }
    ),
    observe: 'response' as 'response'
  };

  constructor(private http: HttpClient, public router: Router) { }

  authenticate(client_id: string, client_secret: string){
    console.log(client_id, "   ", client_secret);
    this.authUrl += "?client_id=" + client_id;
    this.authUrl += "&response_type=code";
    this.authUrl += "&redirect_uri=http://localhost:4200/authenticate";
    this.authUrl += "&show_dialog=false";

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

    console.log("clientidand secret  " + client_id +  "  " + client_secret);

    this.fetchRespOpbject(body);
  }

  fetchRespOpbject(body: string){
    console.log(body);

    let auth: string = 'Basic ' + btoa(localStorage.getItem('client_id') + ":" + localStorage.getItem('client_secret'));
    console.log("Auth string is: "+ auth);

    this.httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': auth
      }),
      observe: 'response' as 'response'
    }
    
    console.log("this is headers get authorization: " + this.httpOptions.headers.get('Authorization'));

    this.isAuthenticated = true;

    this.http.post<RespObject>("https://accounts.spotify.com/api/token", body, this.httpOptions).pipe(
      catchError(
        err => {
          if(err.status == 401){
            this.isAuthenticated = false;
          }
          let empty: any;
          return of(empty);
        }
      )
    ).subscribe(
        res => {
          console.log("response: "+ res);
          console.log("response body: "+res.body);
          console.log("response status:" + res.status);
          console.log("response status text: " +res.statusText);

          this.respObject = res.body as RespObject;
          console.log("response object: " + this.respObject);

          console.log("response object acces token: "+this.respObject?.access_token);
          console.log("response object expires_in: "+this.respObject?.expires_in);
          console.log("response object token type: "+this.respObject?.token_type);
          console.log("response object refresh token: "+this.respObject?.refresh_token);
          localStorage.setItem('acces_token', this.respObject.access_token);
          localStorage.setItem("refresh_token", this.respObject.refresh_token);
          this.router.navigate(['/authenticate']);
          window.location.reload();
        }
      );
  }

  refreshAccesToken(){
    let refresh_token = localStorage.getItem('refresh_token');
    let body = "&grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;

    let auth: string = 'Basic ' + btoa(localStorage.getItem('client_id') + ":" + localStorage.getItem('client_secret'));
    // console.log("Auth string is: "+ auth);

    this.httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': auth
      }),
      observe: 'response' as 'response'
    }


    console.log("refresh: " + body);
    // this.fetchRespOpbject(body);

    this.isAuthenticated = true;
    this.http.post<RefreshRespObject>("https://accounts.spotify.com/api/token", body, this.httpOptions).pipe(
      catchError(
        err => {
          if(err.status == 401){
            this.isAuthenticated = false;
          }
          let empty: any;
          return of(empty);
        }
      )
    ).subscribe(
        res => {
          console.log("Response: ",res);
          let response: RefreshRespObject = res.body as RefreshRespObject;
          // save the new acces token
          localStorage.setItem("acces_token", response.access_token);
          this.router.navigate(['/search']);
        }
      )
  }

  getUser(): Observable<SpotifyUser>{
    let auth: string = 'Bearer ' + localStorage.getItem('acces_token');
    let httpOptions = {
      headers: new HttpHeaders(
        {'Authorization': auth,
        'Content-Type': 'application/json'
         }
      )
    }

    let result = this.http.get<SpotifyUser>("https://api.spotify.com/v1/me", httpOptions)
    return result;
  }

  getCurrentUserPlayLists(): Observable<PlaylistRespObject>{
    let auth: string = 'Bearer ' + localStorage.getItem('acces_token');
    let httpOptions = {
      headers: new HttpHeaders(
        {'Authorization': auth,
        'Content-Type': 'application/json'
         }
      )
    }

    return this.http.get<PlaylistRespObject>("https://api.spotify.com/v1/me/playlists", httpOptions)
  }

  search(query: string, conditions: string): Observable<any>{
    let auth: string = 'Bearer ' + localStorage.getItem('acces_token');
    let httpOptions = {
      headers: new HttpHeaders(
        {'Authorization': auth,
        'Content-Type': 'application/json'
         }
      )
    }

    let baseUrl: string = "https://api.spotify.com/v1/search";
    baseUrl += "?q=" + query;
    baseUrl += "&type=" + conditions;
    baseUrl += "&market=TR";
    baseUrl += "&limit=15";
    baseUrl += "&offset=0";

    return this.http.get<any>(baseUrl, httpOptions).pipe(
      catchError((err) => {
        console.log("err: ", err);
        if(err.status == 401){
          this.refreshAccesToken();
        }
        window.location.reload();
        return this.http.get<any>(baseUrl, httpOptions);
      })
    );
  }

  searchWithOffset(query: string, conditions: string, offset: number): Observable<any>{
    let auth: string = 'Bearer ' + localStorage.getItem('acces_token');
    let httpOptions = {
      headers: new HttpHeaders(
        {'Authorization': auth,
        'Content-Type': 'application/json'
         }
      )
    }

    let baseUrl: string = "https://api.spotify.com/v1/search";
    baseUrl += "?q=" + query;
    baseUrl += "&type=" + conditions;
    baseUrl += "&market=TR";
    baseUrl += "&limit=15";
    baseUrl += "&offset=" + offset;

    return this.http.get<any>(baseUrl, httpOptions).pipe(
      catchError((err) => {
        console.log("err: ", err);
        if(err.status == 401){
          this.refreshAccesToken();
        }
        window.location.reload();
        return this.http.get<any>(baseUrl, httpOptions);
      }),
      map(
        data => {
          let obj = JSON.parse(JSON.stringify(data));
          return obj;
        }
      )
    );
  }

  get(url: string): Observable<any>{
    let auth: string = 'Bearer ' + localStorage.getItem('acces_token');
    let httpOptions = {
      headers: new HttpHeaders(
        {'Authorization': auth,
        'Content-Type': 'application/json'
         }
      )
    }

    console.log("httpoptions", auth);

    return this.http.get<any>(url, httpOptions).pipe(
      catchError((err) => {
        console.log("err: ", err);
        if(err.status == 401){
          this.refreshAccesToken();
        }
        return this.http.get<any>(url, httpOptions);
      })
    );
  }

  isAuthenticatedService(){

    let client_id = localStorage.getItem('client_id');
    let client_secret = localStorage.getItem('client_secret');
    let acces_token = localStorage.getItem('acces_token');
    let refresh_token = localStorage.getItem('refresh_token');

    if(client_id && client_secret && acces_token && refresh_token){
      this.isAuthenticated = true;
    }

    if(!acces_token || !refresh_token){
      this.isAuthenticated = false;
    }

    if(!this.isAuthenticated){
      this.router.navigate(['/authenticate']);
    }
  }
}
