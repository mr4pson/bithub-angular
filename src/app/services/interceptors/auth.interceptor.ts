import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class CAuthInterceptor implements HttpInterceptor {  
    constructor(private router: Router) {}

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(tap(event => {
            if (event instanceof HttpResponse && event.body["statusCode"] === 403) {
                this.router.navigateByUrl("/ru/auth/logout");
            }
        }));        
    }
}
