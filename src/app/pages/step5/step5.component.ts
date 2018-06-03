import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
  styleUrls: ['./step5.component.less']
})
export class Step5Component implements OnInit {
  success = true; // change this to false to display declined policy message

  constructor() {
  }

  ngOnInit() {
  }

}
