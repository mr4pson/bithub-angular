import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CHeaderComponent } from './header/header.component';
import { CMenuMainComponent } from './menus/menu-main/menu-main.component';
import { CMenuLangsComponent } from './menus/menu-langs/menu-langs.component';
import { CPanelLangsComponent } from './panels/panel-langs/panel-langs.component';
import { CPanelMobComponent } from './panels/panel-mob/panel-mob.component';
import { CMenuMainService } from './menus/menu-main/menu-main.service';
import { CPopupLoginComponent } from './popups/popup-login/popup-login.component';
import { CPanelAccountComponent } from './panels/panel-account/panel-account.component';
import { CPopupRegisterComponent } from './popups/popup-register/popup-register.component';
import { CPopupRecoverComponent } from './popups/popup-recover/popup-recover.component';
import { CInputPasswordComponent } from './inputs/input-password/input-password.component';
import { CCaptchaService } from './inputs/captcha/captcha.service';
import { CCaptchaComponent } from './inputs/captcha/captcha.component';
import { CPopupErrorComponent } from './popups/popup-error/popup-error.component';
import { CInputSearchComponent } from './inputs/input-search/input-search.component';
import { CPaginationComponent } from './pagination/pagination.component';
import { CProgress1Component } from './progress/progress1/progress1.component';
import { CProgress2Component } from './progress/progress2/progress2.component';
import { CPanelFavoritesComponent } from './panels/panel-favorites/panel-favorites.component';
import { CPopupSubscriptionComponent } from './popups/popup-subscription/popup-subscription.component';
import { CTariffComponent } from './tariff/tariff.component';
import { CPromocodeComponent } from './inputs/promocode/promocode.component';
import { CPanelInorderComponent } from './panels/panel-inorder/panel-inorder.component';
import { CInputNumberComponent } from './inputs/input-number/input-number.component';
import { CDirectivesModule } from 'src/app/directives/directives.module';
import { CPipesModule } from 'src/app/pipes/pipes.module';
import { CImagePickerComponent } from './inputs/image-picker/image-picker.component';
import { CPopupLimitComponent } from './popups/popup-limit/popup-limit.component';
import { CUpperComponent } from './upper/upper.component';
import { CPopupPasswordComponent } from './popups/popup-password/popup-password.component';
import { CInputRadioComponent } from './inputs/input-radio/input-radio.component';
import { CInputTextareaComponent } from './inputs/input-textarea/input-textarea.component';
import { CBtnFavoritionComponent } from './buttons/favorition/btn-favorition.component';
import { CBtnUnviewedComponent } from './buttons/unviewed/btn-unviewed.component';
import { CPanelUnviewedComponent } from './panels/panel-unviewed/panel-unviewed.component';
import { PanelCartComponent } from './panels/panel-cart/panel-cart.component';
import { CPanelUnviewedService } from './panels/panel-unviewed/panel-unviewed.service';
import { CPopupUnviewedComponent } from './popups/popup-unviewed/popup-unviewed.component';
import { CSelectUserComponent } from './inputs/select/entity/select-user/select-user.component';
import { CSelectGuideComponent } from './inputs/select/entity/select-guide/select-guide.component';
import { CSelectTaskComponent } from './inputs/select/entity/select-task/select-task.component';
import { CHelpComponent } from './help/help.component';
import { CExpandableComponent } from './expandable/expandable.component';
import { CDatePickerComponent } from './inputs/dates/date-picker/date-picker.component';
import { CYearPickerComponent } from './inputs/dates/year-picker/year-picker.component';
import { CEntitySortingComponent } from './inputs/entity-sorting/entity-sorting.component';
import { CPopupBaxersComponent } from './popups/popup-baxers/popup-baxers.component';
import { CPopupBaxersService } from './popups/popup-baxers/popup-baxers.service';
import { CScoreDiagramBigComponent } from './score-diagram/big/sd-big.component';
import { CScoreDiagramSmallComponent } from './score-diagram/small/sd-small.component';
import { CSelectSimpleComponent } from './inputs/select/simple/select-simple/select-simple.component';
import { CDatemarksCalendarComponent } from './inputs/dates/datemarks-calendar/datemarks-calendar.component';
import { CBtnLinkComponent } from './buttons/link/btn-link.component';
import { CScoreScaleComponent } from './score-scale/score-scale.component';
import { CPopupVerifComponent } from './popups/popup-verif/popup-verif.component';
import { CSubscriptionComponent } from './subscription/subscription.component';
import { CLvlUpBtnComponent } from './header/lvl-up-btn/lvl-up-btn.component';
import { CQuantitySelectorComponent } from './quantity-selector/quantity-selector.component';
import { CPopupInorderComponent } from './popups/popup-inorder/popup-inorder.component';
import { TooltipDirective } from './tooltip/tooltip.directive';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    CPipesModule,
    CDirectivesModule,
  ],
  declarations: [
    CQuantitySelectorComponent,
    CLvlUpBtnComponent,
    CHeaderComponent,
    CMenuMainComponent,
    CMenuLangsComponent,
    CPanelLangsComponent,
    CPanelMobComponent,
    CPanelAccountComponent,
    CPanelFavoritesComponent,
    CPanelInorderComponent,
    CPanelUnviewedComponent,
    PanelCartComponent,
    CPopupLoginComponent,
    CPopupVerifComponent,
    CPopupRegisterComponent,
    CPopupInorderComponent,
    CPopupRecoverComponent,
    CPopupErrorComponent,
    CPopupSubscriptionComponent,
    CPopupLimitComponent,
    CPopupPasswordComponent,
    CPopupUnviewedComponent,
    CPopupBaxersComponent,
    CInputPasswordComponent,
    CInputSearchComponent,
    CInputNumberComponent,
    CInputRadioComponent,
    CInputTextareaComponent,
    CCaptchaComponent,
    CPaginationComponent,
    CScoreDiagramBigComponent,
    CScoreDiagramSmallComponent,
    CScoreScaleComponent,
    CProgress1Component,
    CProgress2Component,
    CBtnFavoritionComponent,
    CBtnUnviewedComponent,
    CBtnLinkComponent,
    CEntitySortingComponent,
    CTariffComponent,
    CSubscriptionComponent,
    CPromocodeComponent,
    CImagePickerComponent,
    CUpperComponent,
    CSelectSimpleComponent,
    CSelectUserComponent,
    CSelectGuideComponent,
    CSelectTaskComponent,
    CHelpComponent,
    CExpandableComponent,
    CDatePickerComponent,
    CYearPickerComponent,
    CDatemarksCalendarComponent,
    TooltipDirective,
  ],
  exports: [
    CQuantitySelectorComponent,
    CLvlUpBtnComponent,
    CHeaderComponent,
    CMenuMainComponent,
    CMenuLangsComponent,
    CPanelLangsComponent,
    CPanelMobComponent,
    CPanelAccountComponent,
    CPanelFavoritesComponent,
    CPanelInorderComponent,
    CPanelUnviewedComponent,
    PanelCartComponent,
    CPopupLoginComponent,
    CPopupVerifComponent,
    CPopupRegisterComponent,
    CPopupInorderComponent,
    CPopupRecoverComponent,
    CPopupErrorComponent,
    CPopupSubscriptionComponent,
    CPopupLimitComponent,
    CPopupPasswordComponent,
    CPopupUnviewedComponent,
    CPopupBaxersComponent,
    CInputPasswordComponent,
    CInputSearchComponent,
    CInputNumberComponent,
    CInputRadioComponent,
    CInputTextareaComponent,
    CCaptchaComponent,
    CPaginationComponent,
    CScoreDiagramBigComponent,
    CScoreDiagramSmallComponent,
    CScoreScaleComponent,
    CProgress1Component,
    CProgress2Component,
    CBtnFavoritionComponent,
    CBtnUnviewedComponent,
    CBtnLinkComponent,
    CEntitySortingComponent,
    CTariffComponent,
    CSubscriptionComponent,
    CPromocodeComponent,
    CImagePickerComponent,
    CUpperComponent,
    CSelectSimpleComponent,
    CSelectUserComponent,
    CSelectGuideComponent,
    CSelectTaskComponent,
    CHelpComponent,
    CExpandableComponent,
    CDatePickerComponent,
    CYearPickerComponent,
    CDatemarksCalendarComponent,
    TooltipDirective,
  ],
  providers: [
    CMenuMainService,
    CCaptchaService,
    CPanelUnviewedService,
    CPopupBaxersService,
  ],
})
export class CComponentsModule {}
