import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CAppService } from 'src/app/services/app.service';
import { CGuideRepository } from 'src/app/services/repositories/guide.repository';
import { CGuide, GuideTypes } from 'src/app/model/entities/guide';
import { ILang } from 'src/app/model/entities/lang';
import { IWords } from 'src/app/model/entities/words';
import { CAuthService } from 'src/app/services/auth.service';
import { CUser } from 'src/app/model/entities/user';
import { CTask } from 'src/app/model/entities/task';

@Component({
  selector: 'guide-page',
  templateUrl: 'guide.page.html',
  styleUrls: ['guide.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CGuidePage implements OnInit {
  public guide: CGuide = null;
  public limitedTasks: CTask[] = [];
  public isGemType = false;

  constructor(
    private appService: CAppService,
    private authService: CAuthService,
    private guideRepository: CGuideRepository,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  get words(): IWords {
    return this.appService.words;
  }
  get lang(): ILang {
    return this.appService.lang.value;
  }
  get title(): string {
    return this.guide?.name[this.lang.slug];
  }
  get user(): CUser {
    return this.authService.user;
  }
  get warningTxt(): string {
    return this.words['guides']?.['ftwarning-txt']?.[this.lang.slug]
      ?.replace(
        /{{site_freetasks}}/g,
        this.appService.settings['site-freetasks']
      )
      ?.replace(/{{user_freetasks}}/g, this.user.freetasks?.toString());
  }

  /////////////////////
  // lifecycle
  /////////////////////

  public async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async (p) => {
      await this.initGuide(parseInt(p['id']));
      this.initSEO();
    });
  }

  private async initGuide(id: number): Promise<void> {
    try {
      if (id === this.guide?.id) return;
      this.guide = null;
      await this.appService.pause(300);
      this.guide = await this.guideRepository.loadOne(id);
      this.isGemType = this.guide.type === GuideTypes.Gem;

      let stepsLimit: number;
      const tasksNum = this.guide.tasks.length;
      const isAuthed = !!this.authService.authData;

      if (!this.authService.authData) {
        const currentCompletions: number[] = JSON.parse(
          localStorage.getItem('completions') ?? '[]'
        );

        this.guide.tasks = this.guide.tasks.map(
          (task) =>
            ({
              ...task,
              completed: currentCompletions.includes(task.id),
            } as CTask)
        );

        console.log(currentCompletions, this.guide.tasks);
      }

      switch (this.guide.type) {
        case GuideTypes.FullStepsAvaliable:
          stepsLimit = tasksNum;
          break;
        case GuideTypes.TwoStepsAvailable:
          stepsLimit = !isAuthed ? 2 : tasksNum;
          break;
        case GuideTypes.LimitAfterAuthAvailable:
          stepsLimit = isAuthed ? this.guide.steps_limit : 0;
          break;
        case GuideTypes.Gem:
          stepsLimit = 0;
          break;
        default:
          stepsLimit = tasksNum;
          break;
      }
      // const stepsLimit = this.guide.type === GuideTypes.FullStepsAvaliable ? this.guide.tasks : thi
      this.limitedTasks = this.guide.tasks.slice(0, stepsLimit);
    } catch (err) {
      err === 404
        ? this.router.navigateByUrl(`/${this.lang.slug}/errors/404`)
        : this.appService.notifyError(err);
    }
  }

  private initSEO(): void {
    this.appService.setTitle(this.title);
    this.appService.setMeta('name', 'description', '');
  }

  ////////////////////
  // events
  ////////////////////

  public onUpdateProgress(): void {
    this.guide.progress = parseFloat(
      (
        (this.guide.tasks.filter((t) => t.type === 'main' && t.completed)
          .length *
          100) /
        this.guide.tasks.filter((t) => t.type === 'main').length
      ).toFixed(1)
    );
  }

  public onSubscribe(): void {
    this.appService.popupSubscriptionActive = true;
  }
}
