import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Artist } from '../playlist';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {

  artist?: Artist;

  constructor(private spotify:SpotifyService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getArtist();

  }

  getArtist(){
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);

    this.spotify.getArtist(id!).subscribe(
      res => {
        console.log(res);
        // let obj = JSON.parse(JSON.stringify(res));

        this.artist = res;
        console.log(this.artist);
      }
    )
  }

}
