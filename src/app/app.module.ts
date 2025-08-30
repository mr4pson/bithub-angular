import { NgModule } from '@angular/core';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { BrowserModule } from '@angular/platform-browser';
import { CAppRoutingModule } from './app-routing.module';
import { CAppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CServicesModule } from './services/services.module';
import { RouteReuseStrategy } from '@angular/router';
import { CAppRouteReuseStrategy } from './app.routereusestrategy';
import { CComponentsModule } from './components/components.module';
import { CHomeModule } from './pages/home/home.module';

@NgModule({
  declarations: [CAppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    CAppRoutingModule,
    CServicesModule,
    CComponentsModule,
    CHomeModule,
    RecaptchaV3Module,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: CAppRouteReuseStrategy },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: '6LdlZ7crAAAAAELNMQ2Fnp-v8h0HVok6bGip1a-h',
    },
  ],
  bootstrap: [CAppComponent],
})
export class AppModule {}
