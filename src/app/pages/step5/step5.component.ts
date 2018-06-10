import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
  styleUrls: ['./step5.component.less']
})
export class Step5Component implements OnInit {
  success: boolean; // change this to false to display declined policy message
  type: string;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.success = this.router.url.indexOf('success-page') > -1;
    this.route.queryParams
      .filter(params => params.type)
      .subscribe(params => {
        this.type = params.type;
      });

  }
}
