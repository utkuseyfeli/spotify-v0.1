import { Component, OnInit } from "@angular/core";
import { RespObject } from "../response";
import { SpotifyService } from "../spotify.service";
import { SpotifyUser } from "../user";
import { PlayList } from "../playlist";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";


@Component({
  selector: "app-authenticate",
  templateUrl: "./authenticate.component.html",
  styleUrls: ["./authenticate.component.css"]
})
export class AuthenticateComponent implements OnInit {

  respObject?: RespObject;
  user?: SpotifyUser;
  playlists?: PlayList[];
  refresh_token?: string;
  
  constructor(private spotify: SpotifyService, public router: Router) { }

  async ngOnInit(){
    console.log("ngoninit ");
    await this.isAuthenticated();

    this.fetchAccessToken();
  }

  authenticate(client_id: string, client_secret: string): void{
    this.spotify.authenticate(client_id, client_secret);
  }

  refreshTokens(): void{
    this.spotify.refreshAccesToken();
  }

  getUser(): void{
    this.spotify.getUser().pipe(
      catchError(async (err) => {
        console.log("err: ", err);
        if (err.status == 401){
          await this.spotify.refreshAccesToken();
        }
        return this.spotify.getUser();
      })
    ).subscribe(
      res => {
        console.log(res);
        this.user = res as SpotifyUser;
        const user = this.user;
        console.log("User country, id, name: " + user.country + " " + user.id + " " + user.display_name);
      }
    );
    
  }

  fetchAccessToken(): void{
    if (window.location.search.length > 0){
      
      let needed: string;
      const code = window.location.search;

      if (code.length > 0){
        const urlParams = new URLSearchParams(code);
        needed = urlParams.get("code")!; // ! is the non-null assertion operator
        console.log("needed is " + needed);

        this.spotify.fetchAccessToken(needed);
      }
      
    }
  }

  getCurrentUserPlaylists(): void{
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

  isAuthenticated(): void{ // check auth!!!!
    const client_id = localStorage.getItem("client_id");
    const client_secret = localStorage.getItem("client_secret");
    const acces_token = localStorage.getItem("acces_token");
    this.refresh_token = localStorage.getItem("refresh_token")!;

    if (client_id && client_secret && acces_token && this.refresh_token){
      this.spotify.isAuthenticated = true;
    }

    if (!acces_token || !this.refresh_token){
      this.spotify.isAuthenticated = false;
    }

    if (this.spotify.isAuthenticated){
      this.router.navigate(["/search"]);
    }

    // this part is going to be for expired tokens
    // console.log("is auth");
    // let url = "https://api.spotify.com/v1/albums/" + "0sNOF9WDwhWunNAHPD3Baj";
    // this.spotify.get(url).subscribe(
    //   res => {
    //     console.log("error statuss: " , res.status)
    //     if(res.status == 401){
    //       this.spotify.isAuthenticated = false;
    //     }else{
    //       this.spotify.isAuthenticated = true;
    //       // this.router.navigate(['/search']);
    //     }
    //   }
    // );
  }

  change(): void{
    this.spotify.isAuthenticated = !this.spotify.isAuthenticated;
  }
}
