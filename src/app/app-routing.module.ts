import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CAccountModule } from './pages/account/account.module';
import { CArticlesModule } from './pages/articles/articles.module';
import { CAuthModule } from './pages/auth/auth.module';
import { CDailersModule } from './pages/dailers/dailers.module';
import { CDropsModule } from './pages/drops/drops.module';
import { CErrorsModule } from './pages/errors/errors.module';
import { CGuideModule } from './pages/guide/guide.module';
import { CHomePage } from './pages/home/page/home.page';
import { CRegisterModule } from './pages/register/register.module';
import { CShopModule } from './pages/shop/shop.module';
import { CStaticModule } from './pages/static/static.module';
import { CStatsModule } from './pages/stats/stats.module';
import { CTaskerModule } from './pages/tasker/tasker.module';
import { CAuthGuard } from './services/guards/auth.guard';

const routes: Routes = [
  { path: '', component: CHomePage, data: { mark: 'home' } }, // mark for reuse
  { path: 'ru', pathMatch: 'full', redirectTo: '/' },
  { path: ':lang', component: CHomePage, data: { mark: 'home' } }, // mark for reuse
  {
    path: ':lang/guide',
    loadChildren: () => CGuideModule,
    canActivate: [],
  },
  { path: ':lang/education', loadChildren: () => CArticlesModule },
  {
    path: ':lang/shop',
    loadChildren: () => CShopModule,
    canActivate: [CAuthGuard],
  },
  { path: ':lang/drops', loadChildren: () => CDropsModule },
  {
    path: ':lang/stats',
    loadChildren: () => CStatsModule,
    canActivate: [CAuthGuard],
  },
  {
    path: ':lang/tasker',
    loadChildren: () => CTaskerModule,
    canActivate: [CAuthGuard],
  },
  {
    path: ':lang/dailers',
    loadChildren: () => CDailersModule,
    canActivate: [CAuthGuard],
  },
  {
    path: ':lang/account',
    loadChildren: () => CAccountModule,
    canActivate: [CAuthGuard],
  },
  { path: ':lang/register', loadChildren: () => CRegisterModule },
  { path: ':lang/auth', loadChildren: () => CAuthModule },
  { path: ':lang/errors', loadChildren: () => CErrorsModule },
  { path: ':lang/:page', loadChildren: () => CStaticModule },
  { path: '**', redirectTo: '/ru/errors/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class CAppRoutingModule {}
