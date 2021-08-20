import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Album, Artist, PlayList, Track } from '../playlist';
import { SpotifyService } from '../spotify.service';
import { debounceTime, distinctUntilChanged, map, switchMap } from "rxjs/operators";
import { Observable, of, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchStr?: string;
  searchCond: string = "";
  playlists?: PlayList[];
  artists?: Artist[];
  albums?: Album[];
  tracks?: Track[];
  private searchTerms = new Subject<string>();
  response!: Observable<JSON>;

  checkBoxDataList = [
    {
      label: 'Albums',
      id: 'album',
      isChecked: false
    },
    {
      label: 'Tracks',
      id: 'track',
      isChecked: false
    },
    {
      label: 'Playlists',
      id: 'playlist',
      isChecked: false
    },
    {
      label: 'Artists',
      id: 'artist',
      isChecked: false
    },
  ];

  constructor(private spotify: SpotifyService, private router: Router) { }

  ngOnInit(){
    // this.searchTerms.pipe(
    //   debounceTime(300),
    //   distinctUntilChanged(),
    // ).subscribe(
    //   ser => {
    //     console.log("serr " + ser);
    //     if(!ser){
    //       this.artists = undefined;
    //       this.playlists = undefined;
    //       this.albums = undefined;
    //       this.tracks = undefined;
    //     }else{
    //       this.spotify.search(ser, this.searchCond).subscribe(
    //         res => {
    //           // console.log(res);
    //           console.log(JSON.parse(JSON.stringify(res)));
    //           let obj = JSON.parse(JSON.stringify(res));
              
    //           if(this.checkBoxDataList[0].isChecked){
    //             this.albums = obj.albums.items;
    //           }
    
    //           if(this.checkBoxDataList[1].isChecked){
    //             this.tracks = obj.tracks.items;
    //           }
    
    //           if(this.checkBoxDataList[2].isChecked){
    //             this.playlists = obj.playlists.items;
    //           }
    
    //           if(this.checkBoxDataList[3].isChecked){
    //             this.artists = obj.artists.items;
    //           }
    //         }
    //       )
    //     }
    //   }
    // )

    this.isAuthenticated();
    
    this.searchTerms.pipe(
      debounceTime(300),
      // distinctUntilChanged(),
      switchMap(term => {
        if(term && this.searchCond){
          let resp = this.spotify.search(term, this.searchCond);
          return resp;
        }else{
          console.log("smap: ");
          this.artists = undefined;
          this.playlists = undefined;
          this.albums = undefined;
          this.tracks = undefined;
          return of(undefined);
        }
      } ),
      map(
        value => {
          if(value !=undefined){
            console.log("map: ",JSON.parse(JSON.stringify(value)));
            let obj = JSON.parse(JSON.stringify(value));
            return obj;
          }else{
            console.log("yoksa burası mı");
          }
        }
      )
    ).subscribe(
      res => {
        console.log("res ",res);
        if(res != undefined){
          if(this.checkBoxDataList[0].isChecked){
            this.albums = res.albums.items;
          }
  
          if(this.checkBoxDataList[1].isChecked){
            this.tracks = res.tracks.items;
          }
  
          if(this.checkBoxDataList[2].isChecked){
            this.playlists = res.playlists.items;
          }
  
          if(this.checkBoxDataList[3].isChecked){
            this.artists = res.artists.items;
          }
        }
      }
    )
  }

  search(){
    // console.log(this.searchStr);
    // this.checkBoxDataList.forEach((value, index)=>{
    //   console.log(value);
    // })

    this.searchCond = "";
    this.checkBoxDataList.forEach((value,index)=>{
      if(value.isChecked){
        this.searchCond += value.id + ","
      }
    });
    this.searchCond = this.searchCond.slice(0, -1);

    // console.log("search condition is: "+this.searchCond);
    this.searchTerms.next(this.searchStr);
  }

  isAuthenticated(){

    let client_id = localStorage.getItem('client_id');
    let client_secret = localStorage.getItem('client_secret');
    let acces_token = localStorage.getItem('acces_token');
    let refresh_token = localStorage.getItem('refresh_token');

    if(client_id && client_secret && acces_token && refresh_token){
      this.spotify.isAuthenticated = true;
    }

    if(!acces_token || !refresh_token){
      this.spotify.isAuthenticated = false;
    }

    if(!this.spotify.isAuthenticated){
      this.router.navigate(['/authenticate']);
    }

    // console.log("is auth");
    // let url = "https://api.spotify.com/v1/albums/" + "0sNOF9WDwhWunNAHPD3Baj";
    // this.spotify.get(url).pipe(
      
    // ).subscribe(
    //   res => {
    //     console.log("error statuss: " , res)
    //     if(res.status == 401){
    //       this.spotify.isAuthenticated = false;
    //       this.router.navigate(['/authenticate']);
    //     }else{
    //       this.spotify.isAuthenticated = true;
    //     }
    //   }
    // );
  }
}

