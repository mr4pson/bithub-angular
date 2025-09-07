import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CAppService } from 'src/app/services/app.service';
import { CTaskRepository } from 'src/app/services/repositories/task.repository';
import { ILang } from 'src/app/model/entities/lang';
import { IWords } from 'src/app/model/entities/words';
import { ActivatedRoute } from '@angular/router';
import { CTask } from 'src/app/model/entities/task';
import { CAuthService } from 'src/app/services/auth.service';
import { CUser } from 'src/app/model/entities/user';
import { cfg } from 'src/app/app.config';

@Component({
  selector: 'the-task',
  templateUrl: 'task.component.html',
  styleUrls: ['task.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CTaskComponent implements OnInit {
  @ViewChild('container', { static: false }) private containerRef: ElementRef;

  @Input() public task: CTask; // тут заголовок и статус таска
  @Input() public no: number;
  @Input() public n: number;
  @Input() public stepsLimit: number;
  @Output() private updateProgress: EventEmitter<void> = new EventEmitter();

  public loadedTask: CTask = null; // подгружаемый контент таска - текст и параметры
  public loading: boolean = false;
  public active: boolean = false;
  public loadingCompletion: boolean = false;
  public linkCopied: boolean = false;

  constructor(
    private appService: CAppService,
    private authService: CAuthService,
    private taskRepository: CTaskRepository,
    private route: ActivatedRoute
  ) {}

  get words(): IWords {
    return this.appService.words;
  }
  get lang(): ILang {
    return this.appService.lang.value;
  }
  get container(): HTMLElement {
    return this.containerRef.nativeElement;
  }
  get user(): CUser {
    return this.authService.user;
  }

  public ngOnInit(): void {
    this.initBehavior();
  }

  private initBehavior(): void {
    // открытие, если в ссылке есть ID таска
    this.route.queryParams.subscribe(async (params) => {
      if (params['task'] === `${this.task.id}`) {
        await this.open();
        const element = await this.appService.getElementById(
          `task-${this.task.id}`
        );
        const headerHeight = window.innerWidth < 1000 ? 60 : 70;
        await this.appService.pause(400); // wait for animation (300+)
        this.appService.win.scrollTo({
          top: element.offsetTop - headerHeight - 15,
          behavior: 'smooth',
        });
      }
    });
  }

  public onHeadClick(): void {
    this.active ? this.close() : this.open();
  }

  public async open(): Promise<void> {
    try {
      if (this.no - 1 >= this.stepsLimit) {
        if (this.user) {
          this.appService.popupSubscriptionActive = true;
        } else {
          this.appService.popupLoginActive = true;
        }

        return;
      }

      if (!this.loadedTask) {
        if (this.loading) return;
        this.loading = true;
        this.loadedTask = await this.taskRepository.loadPaidOne(this.task.id);

        await this.appService.pause(300);
        await this.appService.waitForImagesLoading(
          `#task-content-${this.task.id}`
        );
        this.loading = false;
      }

      const height = this.container.scrollHeight;
      this.container.style.height = `${height}px`;
      await this.appService.pause(300);
      this.container.style.height = 'auto';
      this.active = true;
      window.dispatchEvent(new Event('unviewed:reload')); // сообщение в кнопку "новое в гайдах"

      if (this.authService.authData) {
        this.authService.load(); // перезагрузка юзера для обновления количества просмотров
      }
    } catch (err) {
      this.loading = false;
      this.onOpenError(err);
    }
  }

  private onOpenError(err: any): void {
    if (err === 409) {
      this.appService.popupSubscriptionActive = true;
      return;
    }

    if (err === 410) {
      this.appService.notifyError(
        this.words['errors']?.['no-parent-subscription']?.[this.lang.slug]
      );
      return;
    }

    this.appService.notifyError(err);
  }

  public async close(): Promise<void> {
    this.container.style.height = `${this.container.scrollHeight}px`;
    await this.appService.pause(0);
    this.container.style.height = '0px';
    this.active = false;
  }

  public async onToggleCompletion(event: PointerEvent): Promise<void> {
    try {
      event.stopPropagation();
      const completed = !this.task.completed;
      this.loadingCompletion = true;
      await this.appService.pause(300);

      if (!this.authService.authData) {
        this.appService.popupLoginActive = true;
        this.loadingCompletion = false;

        return;
      }

      await this.taskRepository.updateCompletion({
        task_id: this.task.id,
        completed,
      });

      this.loadingCompletion = false;
      this.task.completed = completed;
      this.updateProgress.emit();
    } catch (err) {
      this.appService.notifyError(err);
      this.loadingCompletion = false;
    }
  }

  public async onCopyLink(event: PointerEvent): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    // раньше тут была просто ссылка на гайд с открытым таском, теперь ссылка на реферальную регистрацию с редиректом на гайд с открытым таском
    //const link = `${window.location.origin}${window.location.pathname}?task=${this.task.id}`;
    //window.navigator.clipboard.writeText(link);
    window.navigator.clipboard.writeText(
      `${cfg.siteUrl}/${this.lang.slug}/register/ref/${this.user.uuid}?redirect=/${this.lang.slug}/guide/${this.task.guide_id}?task=${this.task.id}`
    );
    this.linkCopied = true;
    await this.appService.pause(1000);
    this.linkCopied = false;
  }
}
