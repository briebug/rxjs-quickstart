import { Component, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, mergeMap, pairwise, takeUntil } from 'rxjs/operators';
import * as $ from 'jquery';

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

@Component({
  selector: 'app-annotate',
  styles: [`
    mat-card {
      width: 400px;
      box-sizing: border-box;
      margin: 16px;
    }

    .card-container {
      position: fixed;
      top: 70px;
      bottom: 0;
      display: flex;
      flex-flow: row wrap;
    }
  `],
  template: `
    <div class="card-container">
      <mat-card>
        <app-line *ngFor="let line of lines" [line]="line"></app-line>
        <app-doc></app-doc>
      </mat-card>
    </div>
  `
})
export class AnnotateComponent implements OnInit {
  lines: Line[] = [];

  ngOnInit() {
    const mouseDown$  = fromEvent(document, 'mousedown');
    const mouseMove$  = fromEvent(document, 'mousemove');
    const mouseUp$    = fromEvent(document, 'mouseup');

    mouseMove$
      .pipe(
        map((e: MouseEvent) => {
          const offset = $(e.target).offset();
          return {
            x: e.clientX - offset.left,
            y: e.clientY - offset.top
          };
        }),
        pairwise(),
        takeUntil(mouseUp$)
      );

    mouseDown$
      .pipe(
        mergeMap(event => mouseMove$),
        map(positions => {
          const p1 = positions[0];
          const p2 = positions[1];
          return {x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y};
        }),
      )
      .subscribe(line => this.lines = [...this.lines, line]);
  }
}
