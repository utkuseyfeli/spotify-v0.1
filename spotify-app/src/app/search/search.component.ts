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

  offsetAlbum: number;
  offsetTrack: number;
  offsetPlaylist: number;
  offsetArtist: number;

  loadAlbum: boolean;
  loadTrack: boolean;
  loadPlaylist: boolean;
  loadArtist: boolean;

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

  constructor(private spotify: SpotifyService, private router: Router) { 
    this.offsetAlbum = 15;
    this.offsetArtist = 15;
    this.offsetPlaylist = 15;
    this.offsetTrack = 15;

    this.loadAlbum = true;
    this.loadArtist = true;
    this.loadTrack = true;
    this.loadPlaylist = true;
  }

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
    this.loadTrack=true;
    this.loadAlbum = true;
    this.loadArtist = true;
    this.loadPlaylist = true;

    this.offsetAlbum = 15;
    this.offsetArtist = 15;
    this.offsetTrack = 15;
    this.offsetPlaylist = 15;

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
  }

  loadMore(offset: number){
    console.log("utkutkutkutkut");
    this.spotify.searchWithOffset(this.searchStr!, this.searchCond, offset).subscribe(
      res => {
        console.log("res ",res);
        if(res != undefined){
          if(this.checkBoxDataList[0].isChecked){
            this.offsetAlbum += res.albums.items.length;
            
            if(res.albums.items.length < 15){
              this.loadAlbum = false;
            }

            this.albums = this.albums?.concat(res.albums.items);
          }
  
          if(this.checkBoxDataList[1].isChecked){
            this.offsetTrack += res.tracks.items.length;

            if(res.tracks.items.length < 15){
              this.loadTrack = false;
            }

            this.tracks = this.tracks?.concat(res.tracks.items);
          }
  
          if(this.checkBoxDataList[2].isChecked){
            this.offsetPlaylist += res.playlists.items.length;

            if(res.playlists.items.length < 15){
              this.loadPlaylist = false;
            }

            this.playlists = this.playlists?.concat(res.playlists.items);
          }
  
          if(this.checkBoxDataList[3].isChecked){
            this.offsetArtist += res.artists.items.length;

            if(res.artists.items.length < 15){
              this.loadArtist = false;
            }

            this.artists = this.artists?.concat(res.artists.items);
          }
        }
      }
    )
  }
}

