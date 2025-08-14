import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CPipesModule } from "src/app/pipes/pipes.module";
import { CDirectivesModule } from "src/app/directives/directives.module";
import { CComponentsModule } from "src/app/components/components.module";
import { CDailersPage } from "./page/dailers.page";
import { CListDailersComponent } from "./components/list-dailers/list-dailers.component";
import { CBtnCompletionComponent } from "./components/btn-completion/btn-completion.component";
import { CPopupDailerComponent } from "./components/popup-dailer/popup-dailer.component";
import { CListDailersService } from "./services/list-dailers.service";

let routes = RouterModule.forChild ([        
    {path: "", component: CDailersPage},   
]);

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        CPipesModule,
        CDirectivesModule,
        CComponentsModule,
        routes,
    ],
    declarations: [
        CDailersPage,    
        CListDailersComponent,  
        CBtnCompletionComponent,    
        CPopupDailerComponent,    
    ],
    exports: [
        CDailersPage,
    ],    
    providers: [
        CListDailersService,
    ],
})
export class CDailersModule {}
