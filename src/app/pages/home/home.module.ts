import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CHomePage } from "./page/home.page";
import { CListCatsComponent } from "./components/list-cats/list-cats.component";
import { CComponentsModule } from "src/app/components/components.module";
import { CListGuidesComponent } from "./components/list-guides/list-guides.component";
import { CGuideComponent } from "./components/guide/guide.component";
import { CListGuidesService } from "./services/list-guides.service";
import { CPopupDatemarksComponent } from "./components/popup-datemarks/popup-datemarks.component";

@NgModule({
    imports: [
		CommonModule,
		RouterModule,
		CComponentsModule,
	],
	declarations: [
		CHomePage,
		CListCatsComponent,
		CListGuidesComponent,
		CGuideComponent,
		CPopupDatemarksComponent,
	],
	exports: [CHomePage],
	providers: [CListGuidesService],
})
export class CHomeModule {}