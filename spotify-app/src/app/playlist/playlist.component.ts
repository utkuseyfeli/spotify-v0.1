import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { PlayList, Track } from '../playlist';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  playlist?: PlayList;

  constructor(private spotify: SpotifyService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id')!;

    let url = "https://api.spotify.com/v1/playlists/" + id;
    url += "?market=TR";

    this.spotify.get(url).pipe(
      map(value => {
        let data = JSON.parse(JSON.stringify(value));
        data.tracks = JSON.parse(JSON.stringify(value.tracks.items));
        let tracks: Track[] = [];
        data.tracks.forEach((track: any) => {
          let xd = JSON.parse(JSON.stringify(track.track));
          tracks.push(xd);
        });
        data.tracks = tracks;
        data.followers = JSON.parse(JSON.stringify(value.followers.total));
        return data;
      })
    ).
    subscribe(
      res => {
        console.log(res);
        this.playlist = res;
      }
    )

  }

}
