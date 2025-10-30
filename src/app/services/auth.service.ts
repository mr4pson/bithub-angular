import { Injectable } from '@angular/core';
import { CAppService } from './app.service';
import { CDataService } from './data.service';
import {
  CUser,
  IUserAuthData,
  IUserEnterByToken,
  IUserLogin,
  IUserRecover,
  IUserRegister,
  IUserUpdate,
  IUserUpdatePassword,
  IUserVerify,
} from 'src/app/model/entities/user';
import { CSocketService } from './socket.service';
import { IKeyValue } from '../model/keyvalue';
import { IResponse } from '../model/dto/response';

@Injectable()
export class CAuthService {
  public user: CUser = null;
  private lid: number = null;

  constructor(
    private dataService: CDataService,
    private appService: CAppService,
    private socketService: CSocketService
  ) {
    const data = localStorage.getItem('authdata');
    data && this.init(JSON.parse(data));
  }

  get authData(): IUserAuthData {
    return this.dataService.authData;
  }
  set authData(v: IUserAuthData) {
    this.dataService.authData = v;
  }

  public logout(): void {
    this.socketService.off([this.lid]);
    this.user = null;
    this.authData = null;
    localStorage.removeItem('authdata');
  }

  public async load(): Promise<void> {
    try {
      this.user = await this.loadMe();
    } catch (err) {
      this.appService.notifyError(err);
    }
  }

  public login(dto: IUserLogin): Promise<number> {
    return new Promise((resolve, reject) =>
      this.dataService.usersLogin(dto).subscribe({
        error: (err) => reject(err.message),
        next: (res) => {
          if (res.statusCode === 200) {
            this.init(res.data);
            this.save();
          }
          resolve(res.statusCode);
        },
      })
    );
  }

  public register(dto: IUserRegister): Promise<number> {
    return new Promise((resolve, reject) =>
      this.dataService.usersRegister(dto).subscribe({
        error: (err) => reject(err.message),
        next: (res) => {
          if (res.statusCode === 201) {
            this.init(res.data);
            this.save();
          }
          resolve(res.statusCode);
        },
      })
    );
  }

  public enterByToken(dto: IUserEnterByToken): Promise<number> {
    return new Promise((resolve, reject) =>
      this.dataService.usersEnterByToken(dto).subscribe({
        error: (err) => reject(err.message),
        next: (res) => {
          if ([200, 201].includes(res.statusCode)) {
            this.init(res.data);
            this.save();
          }
          resolve(res.statusCode);
        },
      })
    );
  }

  public verify(dto: IUserVerify): Promise<void> {
    return new Promise((resolve, reject) =>
      this.dataService.usersVerify(dto).subscribe({
        next: () => resolve(),
        error: (err) => reject(err.message),
      })
    );
  }

  public recover(dto: IUserRecover): Promise<number> {
    return new Promise((resolve, reject) =>
      this.dataService.usersRecover(dto).subscribe({
        error: (err) => reject(err.message),
        next: (res) => resolve(res.statusCode),
      })
    );
  }

  public unsubscribe(uuid: string): Promise<number> {
    return new Promise((resolve, reject) =>
      this.dataService.usersUnsubscribe(uuid).subscribe({
        error: (err) => reject(err.message),
        next: (res) => resolve(res.statusCode),
      })
    );
  }

  public loadMe(): Promise<CUser> {
    return new Promise((resolve, reject) =>
      this.dataService.usersMe().subscribe({
        next: (res) =>
          res.statusCode === 200
            ? resolve(new CUser().build(res.data))
            : reject(res.error),
        error: (err) => reject(err.message),
      })
    );
  }

  public updateMe(dto: IUserUpdate): Promise<CUser> {
    const fd = this.buildFormData(dto);
    return new Promise((resolve, reject) =>
      this.dataService.usersUpdateMe(fd).subscribe({
        next: (res) =>
          res.statusCode === 200
            ? resolve(new CUser().build(res.data))
            : reject(res.error),
        error: (err) => reject(err.message),
      })
    );
  }

  public updatePassword(dto: IUserUpdatePassword): Promise<number> {
    return new Promise((resolve, reject) =>
      this.dataService.usersUpdatePassword(dto).subscribe({
        next: (res) => resolve(res.statusCode),
        error: (err) => reject(err.message),
      })
    );
  }

  public deactivate(): Promise<void> {
    return new Promise((resolve, reject) =>
      this.dataService.usersDeactivate().subscribe({
        next: (res) => (res.statusCode === 200 ? resolve() : reject(res.error)),
        error: (err) => reject(err.message),
      })
    );
  }

  public getTgInvite(): Promise<IResponse<string>> {
    return new Promise((resolve, reject) =>
      this.dataService.usersGetTgInvite().subscribe({
        next: (res) => resolve(res),
        error: (err) => reject(err.message),
      })
    );
  }

  //////////////////
  // utils
  //////////////////

  public init(data: IUserAuthData): void {
    this.authData = data;
    this.load();
    this.lid = this.socketService.on(`user:reload:${this.authData.id}`, () =>
      this.load()
    ); // реакция на пополнение
  }

  public save(): void {
    localStorage.setItem('authdata', JSON.stringify(this.authData));
  }

  private buildFormData(x: IKeyValue<any>): FormData {
    const fd = new FormData();
    const data = (window as any).structuredClone(x); // deep copy, to prevent iface reaction for some rebuild :-)

    for (let field in data) {
      if (data[field] instanceof File) {
        fd.append(field, data[field] as unknown as File);
      }
    }

    fd.append('data', JSON.stringify(data));
    return fd;
  }
}
