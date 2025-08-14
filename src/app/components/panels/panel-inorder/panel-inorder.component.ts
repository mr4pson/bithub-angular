import { Component } from '@angular/core';
import { CPanelComponent } from '../panel.component';
import { CAppService } from 'src/app/services/app.service';
import { CInorderRepository } from 'src/app/services/repositories/inorder.repository';

@Component({
  selector: 'panel-inorder',
  templateUrl: 'panel-inorder.component.html',
  styleUrls: [
    'panel-inorder.component.scss',
    '../panel.component.scss',
    '../../../styles/forms.scss',
  ],
})
export class CPanelInorderComponent extends CPanelComponent {
  public amount: number = 10;
  public loading: boolean = false;

  constructor(
    protected override appService: CAppService,
    protected inorderRepository: CInorderRepository
  ) {
    super(appService);
  }

  public async onSubmit(): Promise<void> {
    try {
      this.loading = true;
      const url = await this.inorderRepository.create({
        amount: this.amount,
        lang_slug: this.lang.slug,
      });
      this.loading = false;
      window.open(url, '_blank');
    } catch (err) {
      this.appService.notifyError(err);
      this.loading = false;
    }
  }
}
