import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {HeaderComponent} from './shared/header/header.component';
import {FooterComponent} from './shared/footer/footer.component';
import {HomeComponent} from './pages/home/home.component';
import {Step1Component} from './pages/step1/step1.component';
import {Step2Component} from './pages/step2/step2.component';
import {ToasterModule, ToasterService} from 'angular5-toaster/dist';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HttpInterceptorService} from './services/http-interceptor.service';
import {HttpRequestService} from './services/http-request.service';
import {ClickOutsideDirective} from './directives/click-outside.directive';
import {WebShopApiService} from './services/web-shop-api.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

const appRoutes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'step1', component: Step1Component},
  {path: 'step2', component: Step2Component},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    Step1Component,
    Step2Component,
    ClickOutsideDirective
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    ToasterModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [ToasterService, {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptorService,
    multi: true,
  }, HttpRequestService, WebShopApiService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
