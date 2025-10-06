import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CPipesModule } from 'src/app/pipes/pipes.module';
import { CDirectivesModule } from 'src/app/directives/directives.module';
import { CComponentsModule } from 'src/app/components/components.module';
import { CSubRegisterPage } from './sub/sub.register.page';
import { CRefRegisterPage } from './ref/ref.register.page';

let routes = RouterModule.forChild([
  { path: 'sub/:uuid/:index', component: CSubRegisterPage },
  { path: 'ref/:uuid', component: CRefRegisterPage },
  { path: '**', redirectTo: '/ru/errors/404' },
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
  declarations: [CSubRegisterPage, CRefRegisterPage],
  exports: [CSubRegisterPage, CRefRegisterPage],
})
export class CRegisterModule {}
