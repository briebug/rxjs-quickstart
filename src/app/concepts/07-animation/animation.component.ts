import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

const BALL_OFFSET = 25;

@Component({
  selector: 'app-animation',
  template: `
  <div class="container">
    <app-circle
      *ngFor="let circle of circles"
      [style.left]="circle.x + 'px'"
      [style.top]="circle.y + 'px'">
    </app-circle>
  </div>
  `
})
export class AnimationComponent implements OnInit {
  circles: any[] = [];

  ngOnInit() {
    fromEvent(document, 'mousemove')
      .pipe(
        map((e: MouseEvent) => this.generatePosition(e))
      )
      .subscribe(circle => this.circles = [...this.circles, circle]);
  }

  generatePosition(e: MouseEvent) {
    const offset = $(e.target).offset();
    return {
      x: e.clientX - offset.left - BALL_OFFSET,
      y: e.pageY - offset.top - BALL_OFFSET
    };
  }
}
