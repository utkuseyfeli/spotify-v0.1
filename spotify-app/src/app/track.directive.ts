import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appTrack]'
})
export class TrackDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
