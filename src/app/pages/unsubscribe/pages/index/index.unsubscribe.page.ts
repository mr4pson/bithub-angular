import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CSimplePage } from 'src/app/pages/simple.page';
import { CAppService } from 'src/app/services/app.service';
import { CAuthService } from 'src/app/services/auth.service';
import { CArticleRepository } from 'src/app/services/repositories/article.repository';
import { CPageRepository } from 'src/app/services/repositories/page.repository';

@Component({
  selector: 'index-unsubscribe-page',
  templateUrl: 'index.unsubscribe.page.html',
  styleUrls: ['index.unsubscribe.page.scss'],
})
export class CIndexUnsubscribePage extends CSimplePage implements OnInit {
  public loading: boolean = false;
  constructor(
    protected override appService: CAppService,
    protected authService: CAuthService,
    protected articleRepository: CArticleRepository,
    protected override pageRepository: CPageRepository,
    protected override route: ActivatedRoute,
    protected override router: Router
  ) {
    super(appService, pageRepository, route, router);
  }

  public async ngOnInit(): Promise<void> {
    this.unsubscribe();
  }

  public async unsubscribe(): Promise<void> {
    try {
      this.loading = true;
      await this.authService.unsubscribe(this.route.snapshot.params['uuid']);

      this.loading = false;
    } catch (err) {
      this.appService.notifyError(err);
    }
  }
}
