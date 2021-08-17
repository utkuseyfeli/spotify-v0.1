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
    
    this.spotify.getTrack(id!).subscribe(
      res => {
        this.track = res;
      }
    )
  }

}
