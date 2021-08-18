import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Album } from '../playlist';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {

  album?: Album;

  constructor(private spotify:SpotifyService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getAlbum();
  }

  getAlbum(){
    const id = this.route.snapshot.paramMap.get('id');

    let url = "https://api.spotify.com/v1/albums/" + id;
    url += "?market=TR";

    this.spotify.get(url).pipe(
      map(value => {
        let data = JSON.parse(JSON.stringify(value));  
        data.tracks = JSON.parse(JSON.stringify(value.tracks.items));
        return data;
      })
    ).subscribe(
      (res) => {
        this.album = res;
      }
    );
  }
}
