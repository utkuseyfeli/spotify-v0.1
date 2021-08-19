import { Component, OnInit } from '@angular/core';
/// <reference types="@types/spotify-web-playback-sdk"/>

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'spotify-app';
  
  ngOnInit(){
    
  }
  
}
