import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.less']
})
export class Step4Component implements OnInit {
  terms = false;
  newsletter = false;
  info = false;

  constructor() { }

  ngOnInit() {
  }

}
