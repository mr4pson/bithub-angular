import { Injectable } from "@angular/core";
import { CAppService } from "./app.service";

@Injectable()
export class CGoogleService {
    constructor(private appService: CAppService) {}
    
    get clientId(): string {return this.appService.settings["google-client-id"];}
    get enterUrl(): string {return this.appService.settings["google-enter-url"];}

    public signIn(): void {        
        const form = this.buildRequestForm();    
        document.body.appendChild(form);
        form.submit();
    }

    public getToken(): string {
        const fragmentString = window.location.hash.substring(1);        
        const regex = /([^&=]+)=([^&]*)/g;
        let params = {};        
        let m: RegExpExecArray = null;

        while (m = regex.exec(fragmentString)) {
            params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }

        return params["access_token"];
    }

    /////////////////
    // utils
    /////////////////

    private buildRequestForm(): HTMLFormElement {
        const form = document.createElement('form');
        const params = {
            client_id: this.clientId,
            redirect_uri: `${window.location.origin}/${this.appService.lang.value.slug}/auth/google-entered`,
            scope: 'profile email',
            response_type: 'token',            
            prompt: "select_account",
            cookie_policy: "none",
        };    
        
        for (let p in params) {
            const input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', p);
            input.setAttribute('value', params[p]);
            form.appendChild(input);
        }  

        form.setAttribute('method', 'GET');
        form.setAttribute('action', this.enterUrl);          
        return form;
    }
}