import { Component, OnInit } from '@angular/core';
import { Album, Artist, PlayList, Track } from '../playlist';
import { SpotifyService } from '../spotify.service';
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Observable, Subject } from 'rxjs';

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
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(
      ser => {
        console.log("serr " + ser);
        if(!ser){
          this.artists = undefined;
          this.playlists = undefined;
          this.albums = undefined;
          this.tracks = undefined;
        }else{
          this.spotify.search(ser, this.searchCond).subscribe(
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
}

