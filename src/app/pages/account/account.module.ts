import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CPipesModule } from "src/app/pipes/pipes.module";
import { CDirectivesModule } from "src/app/directives/directives.module";
import { CComponentsModule } from "src/app/components/components.module";
import { CProfilePersonalComponent } from "./components/profile-personal/profile-personal.component";
import { CProfileFinancesComponent } from "./components/profile-finances/profile-finances.component";
import { CListChildrenComponent } from "./components/list-children/list-children.component";
import { CProfileChildrenComponent } from "./components/profile-children/profile-children.component";
import { CProfileRefereesComponent } from "./components/profile-referees/profile-referees.component";
import { CListRefereesComponent } from "./components/list-referees/list-referees.component";
import { CProfileSecurityComponent } from "./components/profile-security/profile-security.component";
import { CAccountPage } from "./page/account.page";
import { CProfileProposalComponent } from "./components/profile-proposal/profile-proposal.component";

let routes = RouterModule.forChild ([        
    {path: "", component: CAccountPage},   
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
        CAccountPage,  
        CProfilePersonalComponent,
        CProfileFinancesComponent,
        CProfileChildrenComponent,
        CProfileRefereesComponent,
        CProfileSecurityComponent,
        CProfileProposalComponent,
        CListChildrenComponent,
        CListRefereesComponent,
    ],
    exports: [
        CAccountPage,
    ],    
})
export class CAccountModule {}
