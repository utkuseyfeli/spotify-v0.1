import { AfterViewInit, Component, ComponentFactoryResolver, Input, OnInit, ViewChild } from '@angular/core';
import { Track } from '../playlist';
import { TrackDirective } from '../track.directive';
import { TrackComponent } from '../track/track.component';

@Component({
  selector: 'app-track-display',
  template: `
  <div class="ad-banner">
    <h3>Advertisements</h3>
    <template appTrack></template>
  </div>
  `,
  styleUrls: ['./track-display.component.css']
})
export class TrackDisplayComponent implements OnInit, AfterViewInit{

  @Input() tracks: Track[];
  currentAddIndex: number = -1;
  @ViewChild(TrackDirective) trackHost: TrackDirective;
  subscription: any;
  interval: any;
  
  constructor(private _componentFactoryResolver: ComponentFactoryResolver) { }
  
  ngOnInit(): void {
  }

  ngAfterViewInit(){
    
  }

  loadComponent() {
    this.currentAddIndex = (this.currentAddIndex + 1) % this.tracks.length;
    let adItem = this.tracks[this.currentAddIndex];
    let componentFactory = this._componentFactoryResolver.resolveComponentFactory(adItem.component);
    let viewContainerRef = this.trackHost.viewContainerRef;
    viewContainerRef.clear();
    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<TrackComponent>componentRef.instance).data = adItem.data;
  }
  getAds() {
    this.interval = setInterval(() => {
      this.loadComponent();
    }, 3000);
  }
  
}
