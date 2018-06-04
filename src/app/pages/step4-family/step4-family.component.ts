import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-step4-family',
  templateUrl: './step4-family.component.html',
  styleUrls: ['./step4-family.component.less']
})
export class Step4FamilyComponent implements OnInit {
  type: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams
      .filter(params => params.type)
      .subscribe(params => {
        this.type = params.type;
      });
  }
}
