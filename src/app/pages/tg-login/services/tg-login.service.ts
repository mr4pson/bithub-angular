import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cfg } from 'src/app/app.config';
import { IUserAuthData } from 'src/app/model/entities/user';

@Injectable()
export class CTgLoginService {
  constructor(private http: HttpClient) {}
  public login(
    tgId: number,
    {
      expires,
      userData,
      signature,
    }: { expires: number; userData: any; signature: string }
  ) {
    return this.http.post<IUserAuthData>(
      `${cfg.apiUrl}/users/tg-login/${tgId}?expires=${expires}&userData=${userData}&signature=${signature}`,
      {}
    );
  }
}
