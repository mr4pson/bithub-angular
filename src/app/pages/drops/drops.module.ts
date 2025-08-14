import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CPipesModule } from "src/app/pipes/pipes.module";
import { CDirectivesModule } from "src/app/directives/directives.module";
import { CComponentsModule } from "src/app/components/components.module";
import { CListDropsService } from "./services/list-drops.service";
import { CDropsPage } from "./page/drops.page";
import { CListDropsComponent } from "./components/list-drops/list-drops.component";

let routes = RouterModule.forChild ([
    {path: "", component: CDropsPage},
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
        CDropsPage,
        CListDropsComponent,
        //CDropComponent,
    ],
    exports: [
        CDropsPage,
    ],
    providers: [
        CListDropsService,
    ],
})
export class CDropsModule {}
