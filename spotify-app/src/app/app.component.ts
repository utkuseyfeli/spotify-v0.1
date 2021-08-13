import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'spotify-app';

  authenticated?: boolean;

  isAuthenticated() {
    if(localStorage.getItem('refresh_token')){
      this.authenticated = true;
    }
  }

  ngOnInit(){
    this.isAuthenticated();
  }

}
