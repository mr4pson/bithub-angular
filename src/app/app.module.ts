import { NgModule } from '@angular/core';
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
    ],
    providers: [
        {provide: RouteReuseStrategy, useClass: CAppRouteReuseStrategy},
    ],
    bootstrap: [CAppComponent]
})
export class AppModule { }
