import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CPipesModule } from 'src/app/pipes/pipes.module';
import { CDirectivesModule } from 'src/app/directives/directives.module';
import { CIndexToolsPage } from './pages/index/index.tools.page';
import { CComponentsModule } from 'src/app/components/components.module';
import { CListToolcatsComponent } from './components/list-toolcats/list-toolcats.component';
import { CListToolsService } from './services/list-tools.service';
import { CListToolsComponent } from './components/list-tools/list-tools.component';
import { CToolComponent } from './components/tool/tool.component';
import { COneToolsPage } from './pages/one/one.tools.page';
import { CBtnReadingComponent } from './components/btn-reading/btn-reading.component';
import { CAuthGuard } from 'src/app/services/guards';

let routes = RouterModule.forChild([
  { path: '', component: CIndexToolsPage },
  { path: ':slug', component: COneToolsPage, canActivate: [CAuthGuard] },
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
    CIndexToolsPage,
    COneToolsPage,
    CListToolcatsComponent,
    CListToolsComponent,
    CToolComponent,
    CBtnReadingComponent,
  ],
  exports: [CIndexToolsPage, COneToolsPage],
  providers: [CListToolsService],
})
export class CToolsModule {}
