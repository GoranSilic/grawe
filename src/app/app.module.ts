import {BrowserModule} from '@angular/platform-browser';
import {NgModule, LOCALE_ID} from '@angular/core';
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
import {Step3Component} from './pages/step3/step3.component';
import {Step4Component} from './pages/step4/step4.component';
import {Step5Component} from './pages/step5/step5.component';
import {Step2Resolver} from './pages/step2/step2.resolver';
import {EditComponent} from './pages/edit/edit.component';
import {Step4FamilyComponent} from './pages/step4-family/step4-family.component';
import {registerLocaleData} from '@angular/common';
import localeSrb from '@angular/common/locales/sr-Latn';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StorageHelperService} from './services/storage-helper.service';
import {AuthGuardStep3, AuthGuardStep4, AuthGuardSuccess} from './services/auth.guard';
import {RedirectPageComponent} from './pages/redirect-page/redirect-page.component';
import {SharedService} from './services/shared.service';
import {HttpModule} from '@angular/http';
import {OmvStepComponent} from './pages/omv-step/omv-step.component';

registerLocaleData(localeSrb, 'sr-Latn');

const appRoutes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'omv-step', component: OmvStepComponent},
  {path: 'step1', component: Step1Component},
  {
    path: 'step2/:insuranceBeginDate/:insuranceEndDate/:fullYear/:travelReason', component: Step2Component,
    resolve: {calculationResponseModel: Step2Resolver}
  },
  {path: 'step3', component: Step3Component, canActivate: [AuthGuardStep3]},
  {path: 'step-details', component: Step4Component, canActivate: [AuthGuardStep4]},
  {path: 'step-insured-persons', component: Step4FamilyComponent, canActivate: [AuthGuardStep4]},
  {path: 'redirect-page/:orderId/:offerId', component: RedirectPageComponent},
  {path: 'success-page', component: Step5Component, canActivate: [AuthGuardSuccess]},
  {path: 'declined-page', component: Step5Component},
  // {path: 'edit', component: EditComponent},
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
    ClickOutsideDirective,
    Step3Component,
    Step4Component,
    Step5Component,
    EditComponent,
    Step4FamilyComponent,
    RedirectPageComponent,
    OmvStepComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    ToasterModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule
  ],
  providers: [ToasterService, {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptorService,
    multi: true,
  }, HttpRequestService, WebShopApiService,
    Step2Resolver, {provide: LOCALE_ID, useValue: 'sr-Latn'},
    StorageHelperService,
    AuthGuardStep3, AuthGuardStep4, AuthGuardSuccess, SharedService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
