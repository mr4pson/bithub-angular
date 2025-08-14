import { RouterModule } from "@angular/router";
import { CGuidePage } from "./page/guide.page";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CPipesModule } from "src/app/pipes/pipes.module";
import { CComponentsModule } from "src/app/components/components.module";
import { CTaskComponent } from "./components/task/task.component";
import { CCommentsComponent } from "./components/comments/comments.component";
import { CCommentComponent } from "./components/comment/comment.component";
import { FormsModule } from "@angular/forms";
import { CDatemarksComponent } from "./components/datemarks/datemarks.component";

let routes = RouterModule.forChild ([
    {path:":id", component: CGuidePage},
    {path: "**", redirectTo: "/ru/errors/404"},
]);

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        CPipesModule,
        CComponentsModule,
        routes,
    ],
    declarations: [
        CGuidePage,
        CTaskComponent,
        CCommentsComponent,
        CCommentComponent,
        CDatemarksComponent,
    ],
    exports: [CGuidePage],
})
export class CGuideModule {}
