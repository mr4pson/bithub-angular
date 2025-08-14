import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CGoogleEnteredPage } from "./google-entered/google-entered.page";
import { CLogoutPage } from "./logout/logout.page";

let routes = RouterModule.forChild ([        
    {path: "google-entered", component: CGoogleEnteredPage},       
    {path: "logout", component: CLogoutPage},       
]);

@NgModule({
    imports: [
        RouterModule,
        CommonModule,        
        routes,
    ],
    declarations: [
        CGoogleEnteredPage,
        CLogoutPage,
    ],
    exports: [
        CGoogleEnteredPage,
        CLogoutPage,
    ],    
})
export class CAuthModule {}
