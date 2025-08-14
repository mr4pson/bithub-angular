import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CPipesModule } from "src/app/pipes/pipes.module";
import { CDirectivesModule } from "src/app/directives/directives.module";
import { CComponentsModule } from "src/app/components/components.module";
import { CStatsPage } from "./page/stats.page";
import { CListStatGuidesComponent } from "./components/list-statguides/list-statguides.component";
import { CStatGuideComponent } from "./components/statguide/statguide.component";
import { CListStatGuidesService } from "./services/list-statguides.service";
import { CPopupCompletionsComponent } from "./components/popup-completions/popup-completions.component";
import { CPopupGuideNoteComponent } from "./components/popup-guidenote/popup-guidenote.component";

let routes = RouterModule.forChild ([        
    {path: "", component: CStatsPage},   
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
        CStatsPage,  
        CListStatGuidesComponent,
        CStatGuideComponent,     
        CPopupCompletionsComponent,   
        CPopupGuideNoteComponent,
    ],
    exports: [
        CStatsPage,
    ],    
    providers: [
        CListStatGuidesService,
    ],
})
export class CStatsModule {}
