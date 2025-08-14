import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CPipesModule } from "src/app/pipes/pipes.module";
import { CDirectivesModule } from "src/app/directives/directives.module";
import { CIndexArticlesPage } from "./pages/index/index.articles.page";
import { CComponentsModule } from "src/app/components/components.module";
import { CListArtcatsComponent } from "./components/list-artcats/list-artcats.component";
import { CListArticlesService } from "./services/list-articles.service";
import { CListArticlesComponent } from "./components/list-articles/list-articles.component";
import { CArticleComponent } from "./components/article/article.component";
import { COneArticlesPage } from "./pages/one/one.articles.page";
import { CBtnReadingComponent } from "./components/btn-reading/btn-reading.component";

let routes = RouterModule.forChild ([        
    {path: "", component: CIndexArticlesPage},    
    {path: ":slug", component: COneArticlesPage},    
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
        CIndexArticlesPage,     
        COneArticlesPage,
        CListArtcatsComponent,  
        CListArticlesComponent,
        CArticleComponent,
        CBtnReadingComponent,
    ],
    exports: [
        CIndexArticlesPage,
        COneArticlesPage,
    ],
    providers: [
        CListArticlesService,
    ],
})
export class CArticlesModule {}
