import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Track } from '../playlist';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {

  track?: Track;

  constructor(private spotify:SpotifyService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getTrack();
  }

  getTrack(){
    const id = this.route.snapshot.paramMap.get('id');

    let url = "https://api.spotify.com/v1/tracks/" + id;
    url += "?market=TR";

    this.spotify.get(url).subscribe(
      (res: Track) => {
        this.track = res;
      }
    )
  }
}
