import { Component, OnInit } from '@angular/core';
import {WebShopApiService} from '../../services/web-shop-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  constructor(private webShopService: WebShopApiService) { }

  ngOnInit() {
    /*this.webShopService.testMethod()
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );*/
  }

}
