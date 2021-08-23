import { Component, Input, OnInit } from '@angular/core';
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
  @Input() id?: string;
  @Input() picSize?: number;

  constructor(private spotify:SpotifyService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.spotify.isAuthenticatedService();
    this.getArtist();
  }

  getArtist(){
    if(!this.id){
      this.id = this.route.snapshot.paramMap.get('id')!;
    }
    
    let url = "https://api.spotify.com/v1/artists/" + this.id;

    this.spotify.get(url).subscribe(
      (res: Artist) => {
        console.log(res);

        this.artist = res;
        console.log(this.artist);
      }
    )
  }

}
