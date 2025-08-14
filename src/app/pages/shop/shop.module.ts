import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CPipesModule } from "src/app/pipes/pipes.module";
import { CDirectivesModule } from "src/app/directives/directives.module";
import { CComponentsModule } from "src/app/components/components.module";
import { CIndexShopPage } from "./pages/index/index.shop.page";
import { CListShopcatsComponent } from "./components/list-shopcats/list-shopcats.component";
import { CListShopitemsComponent } from "./components/list-shopitems/list-shopitems.component";
import { CShopitemComponent } from "./components/shopitem/shopitem.component";
import { CListShopitemsService } from "./services/list-shopitems.service";
import { CItemShopPage } from "./pages/item/item.shop.page";
import { CPopupShoporderComponent } from "./components/popup-shoporder/popup-shoporder.component";

let routes = RouterModule.forChild ([
    {path: "", component: CIndexShopPage},
    {path: ":id", component: CItemShopPage},
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
        CIndexShopPage,
        CItemShopPage,
        CListShopcatsComponent,
        CListShopitemsComponent,
        CShopitemComponent,
        CPopupShoporderComponent,
    ],
    exports: [
        CIndexShopPage,
        CItemShopPage,
    ],
    providers: [
        CListShopitemsService,
    ],
})
export class CShopModule {}
