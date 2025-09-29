import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IResponse } from 'src/app/model/dto/response';
import { ISettings } from 'src/app/model/entities/settings';
import { IWords } from 'src/app/model/entities/words';
import { ILang } from 'src/app/model/entities/lang';
import { IPage } from 'src/app/model/entities/page';
import { Router } from '@angular/router';
import { cfg } from 'src/app/app.config';
import { IFiles } from 'src/app/model/entities/files';
import { IGetList } from 'src/app/model/dto/getlist';
import {
  IUser,
  IUserAuthData,
  IUserEnterByToken,
  IUserLogin,
  IUserRecover,
  IUserRegister,
  IUserUpdatePassword,
  IUserVerify,
} from 'src/app/model/entities/user';
import { ICat } from 'src/app/model/entities/cat';
import { ICompletionUpdate } from 'src/app/model/dto/completion.update';
import { IFavoritionUpdate } from 'src/app/model/dto/favorition.update';
import { ISubscriptionTariff } from 'src/app/model/entities/subscription.tariff';
import { IPromocode } from 'src/app/model/entities/promocode';
import { IInorderCreate } from 'src/app/model/dto/inorder.create';
import { IOutorderCreate } from '../model/dto/outorder.create';
import { IOnetimeTariff } from '../model/entities/onetime.tariff';
import { IGuideNoteSave } from '../model/dto/guide.note.save';
import { IViewed } from '../model/dto/viewed';
import { IDesk, TDeskMode } from '../model/entities/desk';
import { CProblem } from '../model/entities/problem';
import { IProblem } from '../model/entities/problem';
import {
  IProblemComment,
  IProblemCommentCreate,
} from '../model/entities/problem.comment';
import { IProblemUpdateDesk } from '../model/dto/problem.update.desk';
import { IReadingUpdate } from '../model/dto/reading.update';
import { IGuide } from '../model/entities/guide';
import { ITask } from '../model/entities/task';
import { IArticle } from '../model/entities/article';
import { IDailer } from '../model/entities/dailer';
import { IBaxer } from '../model/entities/baxer';
import { IComment } from '../model/entities/comment';
import { ICommentCreate } from '../model/dto/comment.create';
import { IArtcat } from '../model/entities/artcat';
import { IShopcat } from '../model/entities/shopcat';
import { IShopitem } from '../model/entities/shopitem';
import { IShoporderCreate } from '../model/dto/shoporder.create';
import { ICompletion } from '../model/entities/completion';
import { IDatemarkGetList, IDatemarkToggle } from '../model/dto/datemarks';
import { IDrop } from '../model/entities/drop';

@Injectable()
export class CDataService {
  public authData: IUserAuthData = null;

  constructor(private http: HttpClient, private router: Router) {}

  public settingsAll(): Observable<IResponse<ISettings>> {
    return this.post('settings/all');
  }

  public langsAll(): Observable<IResponse<ILang[]>> {
    return this.post('langs/all');
  }

  public wordsAll(): Observable<IResponse<IWords>> {
    return this.post(`words/all`);
  }

  public filesAll(): Observable<IResponse<IFiles>> {
    return this.post('files/all');
  }

  public pagesOne(slug: string): Observable<IResponse<IPage>> {
    return this.post(`pages/one/${slug}`);
  }
  public pagesMenuMain(): Observable<IResponse<IPage[]>> {
    return this.post('pages/menu-main');
  }
  public pagesMenuFoot(): Observable<IResponse<IPage[]>> {
    return this.post('pages/menu-foot');
  }

  public usersLogin(dto: IUserLogin): Observable<IResponse<IUserAuthData>> {
    return this.post('users/login', dto);
  }
  public usersRegister(
    dto: IUserRegister
  ): Observable<IResponse<IUserAuthData>> {
    return this.post('users/register', dto);
  }
  public usersEnterByToken(
    dto: IUserEnterByToken
  ): Observable<IResponse<IUserAuthData>> {
    return this.post('users/enter-by-token', dto);
  }
  public usersVerify(dto: IUserVerify): Observable<IResponse<void>> {
    return this.post('users/create-verification', dto);
  }
  public usersRecover(dto: IUserRecover): Observable<IResponse<void>> {
    return this.post('users/recover', dto);
  }
  public usersMe(): Observable<IResponse<IUser>> {
    return this.post(`users/me`);
  }
  public usersOne(id: number): Observable<IResponse<IUser>> {
    return this.post(`users/one/${id}`);
  }
  public usersUpdateMe(fd: FormData): Observable<IResponse<IUser>> {
    return this.post('users/update-me', fd);
  }
  public usersUpdatePassword(
    dto: IUserUpdatePassword
  ): Observable<IResponse<void>> {
    return this.post('users/update-password', dto);
  }
  public usersCanBeParent(uuid: string): Observable<IResponse<void>> {
    return this.post(`users/can-be-parent/${uuid}`);
  }
  public usersIsExists(uuid: string): Observable<IResponse<void>> {
    return this.post(`users/is-exists/${uuid}`);
  }
  public verify(
    code: number
  ): Observable<{ statusCode: number; error: string }> {
    return this.post(`users/verify`, { code });
  }
  public usersChildrenChunk(dto: IGetList): Observable<IResponse<IUser[]>> {
    return this.post('users/children-chunk', dto);
  }
  public usersRefereesChunk(dto: IGetList): Observable<IResponse<IUser[]>> {
    return this.post('users/referees-chunk', dto);
  }
  public usersRemoveSubacc(id: number): Observable<IResponse<IUser[]>> {
    return this.post(`users/remove-subacc/${id}`);
  }
  public usersDeactivate(): Observable<IResponse<void>> {
    return this.post('users/deactivate');
  }
  public usersGetTgInvite(): Observable<IResponse<string>> {
    return this.post('users/get-tg-invite');
  }

  public catsAll(): Observable<IResponse<ICat[]>> {
    return this.post('cats/all');
  }

  public guidesChunk(dto: IGetList): Observable<IResponse<IGuide[]>> {
    return this.post('guides/chunk', dto);
  }
  public guidesFavoritesChunk(dto: IGetList): Observable<IResponse<IGuide[]>> {
    return this.post('guides/favorites-chunk', dto);
  }
  public guidesStatChunk(dto: IGetList): Observable<IResponse<IGuide[]>> {
    return this.post('guides/stat-chunk', dto);
  }
  public guidesStatCompletions(
    guide_id: number
  ): Observable<IResponse<ICompletion[]>> {
    return this.post(`guides/stat-completions/${guide_id}`);
  }
  public guidesOne(id: number): Observable<IResponse<IGuide>> {
    return this.post(`guides/one/${id}`);
  }
  public guidesOneBySlug(slug: string): Observable<IResponse<IGuide>> {
    return this.post(`guides/one-by-slug/${slug}`);
  }
  public guidesProgress(id: number): Observable<IResponse<number>> {
    return this.post(`guides/progress/${id}`);
  }
  public guidesUpdateFavorition(
    dto: IFavoritionUpdate
  ): Observable<IResponse<void>> {
    return this.post('guides/update-favorition', dto);
  }
  //public guidesUpdateReminder(dto: IReminderUpdate): Observable<IResponse<void>> {return this.post("guides/update-reminder", dto);}
  //public guidesUpdateExecution(dto: IExecutionUpdate): Observable<IResponse<void>> {return this.post("guides/update-execution", dto);}

  public tasksOne(id: number): Observable<IResponse<ITask>> {
    return this.post(`tasks/one/${id}`);
  }
  public tasksPaidOne(id: number): Observable<IResponse<ITask>> {
    return this.post(`tasks/paid-one/${id}`);
  }
  public tasksUpdateCompletion(
    dto: ICompletionUpdate
  ): Observable<IResponse<void>> {
    return this.post('tasks/update-completion', dto);
  }
  public tasksUnviewedChunk(dto: IGetList): Observable<IResponse<ITask[]>> {
    return this.post('tasks/unviewed-chunk', dto);
  }
  public tasksUnviewedQuantity(
    favorites: boolean
  ): Observable<IResponse<number>> {
    return this.post(`tasks/unviewed-quantity/${favorites}`);
  }
  public tasksViewed(dto: IViewed): Observable<IResponse<number[]>> {
    return this.post('tasks/viewed', dto);
  }

  public tariffsSubscriptionAll(): Observable<
    IResponse<ISubscriptionTariff[]>
  > {
    return this.post('tariffs/subscription-all');
  }
  public tariffsOnetimeOne(
    code: string
  ): Observable<IResponse<IOnetimeTariff>> {
    return this.post(`tariffs/onetime-one/${code}`);
  }

  public promocodesOne(code: string): Observable<IResponse<IPromocode>> {
    return this.post(`promocodes/one/${code}`);
  }

  public inordersCreate(dto: IInorderCreate): Observable<IResponse<string>> {
    return this.post('inorders/create', dto);
  }

  public outordersCreate(dto: IOutorderCreate): Observable<IResponse<void>> {
    return this.post('outorders/create', dto);
  }

  public guideNotesSave(dto: IGuideNoteSave): Observable<IResponse<void>> {
    return this.post('guide-notes/save', dto);
  }

  public desksAll(mode: TDeskMode): Observable<IResponse<IDesk[]>> {
    return this.post(`desks/all/${mode}`);
  }
  public desksOne(id: number): Observable<IResponse<IDesk>> {
    return this.post(`desks/one/${id}`);
  }
  public desksUpdate(dto: IDesk): Observable<IResponse<void>> {
    return this.post('desks/update', dto);
  }
  public desksDelete(id: number): Observable<IResponse<void>> {
    return this.post(`desks/delete/${id}`);
  }
  public desksCreate(mode: TDeskMode): Observable<IResponse<IDesk>> {
    return this.post(`desks/create/${mode}`);
  }

  public problemsUpdate(x: CProblem): Observable<IResponse<void>> {
    return this.post('problems/update', x);
  }
  public problemsCreate(x: CProblem): Observable<IResponse<void>> {
    return this.post('problems/create', x);
  }
  public problemsOneEditable(id: number): Observable<IResponse<IProblem>> {
    return this.post(`problems/one-editable/${id}`);
  }
  public problemsOneViewable(id: number): Observable<IResponse<IProblem>> {
    return this.post(`problems/one-viewable/${id}`);
  }
  public problemsDelete(id: number): Observable<IResponse<void>> {
    return this.post(`problems/delete/${id}`);
  }
  public problemsUpdateViewing(id: number): Observable<IResponse<void>> {
    return this.post(`problems/update-viewing/${id}`);
  }
  public problemsUpdateDesk(
    dto: IProblemUpdateDesk
  ): Observable<IResponse<void>> {
    return this.post('problems/update-desk', dto);
  }

  public problemCommentsChunk(
    dto: IGetList
  ): Observable<IResponse<IProblemComment[]>> {
    return this.post('problem-comments/chunk', dto);
  }
  public problemCommentsCreate(
    dto: IProblemCommentCreate
  ): Observable<IResponse<void>> {
    return this.post('problem-comments/create', dto);
  }

  public proposalsCreate(content: string): Observable<IResponse<void>> {
    return this.post('proposals/create', { content });
  }

  public artcatsAll(): Observable<IResponse<IArtcat[]>> {
    return this.post('artcats/all');
  }

  public articlesChunk(dto: IGetList): Observable<IResponse<IArticle[]>> {
    return this.post('articles/chunk', dto);
  }
  public articlesOne(slug: string): Observable<IResponse<IArticle>> {
    return this.post(`articles/one/${slug}`);
  }
  public articlesUpdateReading(
    dto: IReadingUpdate
  ): Observable<IResponse<void>> {
    return this.post('articles/update-reading', dto);
  }

  public dailersChunk(dto: IGetList): Observable<IResponse<IDailer[]>> {
    return this.post('dailers/chunk', dto);
  }
  public dailersSave(x: IDailer): Observable<IResponse<IDailer>> {
    return this.post('dailers/save', x);
  }
  public dailersDelete(id: number): Observable<IResponse<void>> {
    return this.post(`dailers/delete/${id}`);
  }

  public baxersAll(): Observable<IResponse<IBaxer[]>> {
    return this.post('baxers/all');
  }

  public commentsChunk(dto: IGetList): Observable<IResponse<IComment[]>> {
    return this.post('comments/chunk', dto);
  }
  public commentsCreate(dto: ICommentCreate): Observable<IResponse<void>> {
    return this.post('comments/create', dto);
  }

  public shopcatsAll(): Observable<IResponse<IShopcat[]>> {
    return this.post('shopcats/all');
  }

  public shopitemsChunk(dto: IGetList): Observable<IResponse<IShopitem[]>> {
    return this.post('shopitems/chunk', dto);
  }
  public shopitemsOne(id: number): Observable<IResponse<IShopitem>> {
    return this.post(`shopitems/one/${id}`);
  }

  public shopordersCreate(
    dto: IShoporderCreate
  ): Observable<IResponse<string>> {
    return this.post('shoporders/create', dto);
  }

  public datemarksAll(dto: IDatemarkGetList): Observable<IResponse<number[]>> {
    return this.post('datemarks/all', dto);
  }
  public datamarksToggle(dto: IDatemarkToggle): Observable<IResponse<void>> {
    return this.post('datemarks/toggle', dto);
  }

  public dropsChunk(dto: IGetList): Observable<IResponse<IDrop[]>> {
    return this.post('drops/chunk', dto);
  }

  private post(url: string, body: any = null): Observable<any> {
    return this.http.post(`${cfg.apiUrl}/${url}`, body);
  }
}
