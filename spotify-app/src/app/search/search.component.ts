import { Component, Input, OnInit } from '@angular/core';
import { Album, Artist, PlayList, Track } from '../playlist';
import { SpotifyService } from '../spotify.service';


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

  checked: boolean[] = [false, false, false, false];
  CONDITIONS = ["album","track", "playlist", "artist"];

  constructor(private spotify: SpotifyService) { }

  ngOnInit(): void {
  }

  search(){ // interesting way to fetch data save this
    console.log(this.searchStr);
    // console.log("form value: " + this.checked[0]);

    let searchCond: string = "";

    for(let i = 0; i < 4; i++){
      if(this.checked[i]){
        searchCond += this.CONDITIONS[i];
        searchCond += ",";
      }
    }

    searchCond = searchCond.slice(0, -1);

    console.log(searchCond);
    // make a call to spotify
    if(this.searchStr){
      this.spotify.search(this.searchStr!, searchCond).subscribe(
        res => {
          console.log(res);
          console.log(JSON.parse(JSON.stringify(res)));
          let obj = JSON.parse(JSON.stringify(res));

          if(this.checked[0]){
            this.albums = obj.albums.items;
          }

          if(this.checked[1]){
            this.tracks = obj.tracks.items;
          }

          if(this.checked[2]){
            this.playlists = obj.playlists.items;
          }

          if(this.checked[3]){
            this.artists = obj.artists.items;
          }
        }
      )
    
    }
    
  }
}
