import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CPipesModule } from "src/app/pipes/pipes.module";
import { CDirectivesModule } from "src/app/directives/directives.module";
import { CComponentsModule } from "src/app/components/components.module";
import { CTaskerPage } from "./page/tasker.page";
import { CTaskerService } from "./services/tasker.service";
import { CTaskerMenuComponent } from "./components/tasker-menu/tasker-menu.component";
import { CListDesksComponent } from "./components/list-desks/list-desks.component";
import { CDeskComponent } from "./components/desk/desk.component";
import { CDeskCreateComponent } from "./components/desk-create/desk-create.component";
import { CDeskProblemComponent } from "./components/desk-problem/desk-problem.component";
import { CPopupProblemEditComponent } from "./components/popup-problem-edit/popup-problem-edit.component";
import { CPopupProblemViewComponent } from "./components/popup-problem-view/popup-problem-view.component";
import { CProblemCommentsComponent } from "./components/problem-comments/problem-comments.component";

let routes = RouterModule.forChild ([        
    {path: "", component: CTaskerPage},   
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
        CTaskerPage,      
        CTaskerMenuComponent,
        CListDesksComponent,
        CDeskComponent,
        CDeskCreateComponent,
        CDeskProblemComponent,
        CPopupProblemEditComponent,
        CPopupProblemViewComponent,
        CProblemCommentsComponent,
    ],
    exports: [
        CTaskerPage,
    ],    
    providers: [
        CTaskerService,
    ],
})
export class CTaskerModule {}
