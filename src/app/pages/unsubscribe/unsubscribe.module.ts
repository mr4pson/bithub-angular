import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CIndexUnsubscribePage } from './pages/index/index.unsubscribe.page';
import { CListArticlesService } from './services/list-articles.service';

let routes = RouterModule.forChild([
  { path: ':uuid', component: CIndexUnsubscribePage },
]);

@NgModule({
  imports: [RouterModule, CommonModule, routes],
  declarations: [CIndexUnsubscribePage],
  exports: [CIndexUnsubscribePage],
  providers: [CListArticlesService],
})
export class CUnsubscribeModule {}
