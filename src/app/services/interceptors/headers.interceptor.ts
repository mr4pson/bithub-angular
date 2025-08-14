import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CDataService } from '../data.service';

@Injectable()
export class CHeadersInterceptor implements HttpInterceptor {
    constructor(private dataService: CDataService) {}

    get token(): string {return this.dataService.authData?.token;}
    
    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const headersContent = {"tz": new Date().getTimezoneOffset().toString()};  
        
        if (this.token) {
            headersContent["token"] = this.token;
        }
        
        const headers = new HttpHeaders(headersContent);        
        const headersRequest = request.clone({headers});
        return next.handle(headersRequest);
    }
}
