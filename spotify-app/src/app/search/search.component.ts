import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Album, Artist, PlayList, Track } from '../playlist';
import { SpotifyService } from '../spotify.service';
import { debounce, debounceTime, delay, distinctUntilChanged } from "rxjs/operators";


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchStr?: string;
  playlists?: PlayList[];
  artists?: Artist[];
  albums?: Album[];
  tracks?: Track[];

  checkBoxDataList = [
    {
      label: 'Albums',
      id: 'album',
      isChecked: true
    },
    {
      label: 'Tracks',
      id: 'track',
      isChecked: true
    },
    {
      label: 'Playlists',
      id: 'playlist',
      isChecked: true
    },
    {
      label: 'Artists',
      id: 'artist',
      isChecked: true
    },
  ];

  constructor(private spotify: SpotifyService) { }

  ngOnInit(): void {
  }

  search(){
    console.log(this.searchStr);
    this.checkBoxDataList.forEach((value, index)=>{
      console.log(value);
    })

    let searchCond: string = "";

    this.checkBoxDataList.forEach((value,index)=>{
      if(value.isChecked){
        searchCond += value.id + ","
      }
    });

    searchCond = searchCond.slice(0, -1);

    console.log("search condition is: "+searchCond);
    // make a call to spotify
    if(this.searchStr){
      this.spotify.search(this.searchStr!, searchCond).pipe(
        debounceTime(2500),
      ).subscribe(
        res => {
          // console.log(res);
          console.log(JSON.parse(JSON.stringify(res)));
          let obj = JSON.parse(JSON.stringify(res));

          if(this.checkBoxDataList[0].isChecked){
            this.albums = obj.albums.items;
          }

          if(this.checkBoxDataList[1].isChecked){
            this.tracks = obj.tracks.items;
          }

          if(this.checkBoxDataList[2].isChecked){
            this.playlists = obj.playlists.items;
          }

          if(this.checkBoxDataList[3].isChecked){
            this.artists = obj.artists.items;
          }
        }
      )      
    }
    
  }
}

