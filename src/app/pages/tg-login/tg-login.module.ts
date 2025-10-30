import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CComponentsModule } from 'src/app/components/components.module';
import { CTgLoginPage } from './page/tg-login.page';
import { CTgLoginService } from './services/tg-login.service';

let routes = RouterModule.forChild([{ path: '', component: CTgLoginPage }]);

@NgModule({
  imports: [CommonModule, RouterModule, CComponentsModule, routes],
  declarations: [CTgLoginPage],
  exports: [CTgLoginPage],
  providers: [CTgLoginService],
})
export class CTgLoginModule {}
