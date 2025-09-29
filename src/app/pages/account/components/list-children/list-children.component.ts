import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ILang } from 'src/app/model/entities/lang';
import { CUser } from 'src/app/model/entities/user';
import { IWords } from 'src/app/model/entities/words';
import { CAppService } from 'src/app/services/app.service';
import { CUserRepository } from 'src/app/services/repositories/user.repository';

@Component({
  selector: 'list-children',
  templateUrl: 'list-children.component.html',
  styleUrls: ['list-children.component.scss'],
})
export class CListChildrenComponent implements OnInit, AfterViewInit {
  @ViewChild('container', { static: false }) private containerRef: ElementRef;

  public users: CUser[] = null;
  private part: number = 0;
  private chunkLength: number = 20;
  private sortBy: string = 'created_at';
  private sortDir: number = -1;
  private exhausted: boolean = false;
  private started_at: Date = null;
  public loadingMore: boolean = false;

  constructor(
    protected appService: CAppService,
    protected userRepository: CUserRepository
  ) {}

  get lang(): ILang {
    return this.appService.lang.value;
  }
  get words(): IWords {
    return this.appService.words;
  }
  get container(): HTMLElement {
    return this.containerRef.nativeElement;
  }
  get scrolledToBottom(): boolean {
    return (
      this.container.scrollTop >=
      this.container.scrollHeight - this.container.offsetHeight - 100
    );
  }
  get canLoadMore(): boolean {
    return !this.loadingMore && !this.exhausted && this.scrolledToBottom;
  }

  public ngOnInit(): void {
    this.initUsers();
  }

  public ngAfterViewInit(): void {
    this.container.addEventListener('scroll', this.onScroll.bind(this));
  }

  private async initUsers(): Promise<void> {
    try {
      this.started_at = new Date(); // для предотвращения дублей в бесконечной прокрутке при добавлении новых элементов после момента, когда первый кусок загружен
      const chunk = await this.userRepository.loadChildrenChunk(
        this.part,
        this.chunkLength,
        this.sortBy,
        this.sortDir
      );
      this.users = chunk.data;
      this.exhausted = this.part + 1 >= chunk.pagesQuantity;
    } catch (err) {
      this.appService.notifyError(err);
    }
  }

  protected async onScroll(): Promise<void> {
    try {
      if (!this.canLoadMore) return;
      this.loadingMore = true;
      this.part++;
      const filter = { created_at_less: this.started_at };
      const chunk = await this.userRepository.loadChildrenChunk(
        this.part,
        this.chunkLength,
        this.sortBy,
        this.sortDir,
        filter
      );
      this.users = [...this.users, ...chunk.data];
      this.exhausted = this.part + 1 >= chunk.pagesQuantity;
      this.loadingMore = false;
    } catch (err) {
      this.appService.notifyError(err);
      this.loadingMore = false;
    }
  }

  public async removeSubacc(subacc: CUser) {
    if (!window.confirm(this.words['common']?.['sure']?.[this.lang.slug]))
      return;

    try {
      await this.userRepository.removeSubacc(subacc.id);

      this.users = this.users.filter((user) => user.id !== subacc.id);
    } catch (error) {
      console.log(error);
    }
  }
}
