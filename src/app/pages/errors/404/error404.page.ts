import { Component } from "@angular/core";
import { CAppService } from "src/app/services/app.service";

@Component({
    selector: "error404-page",
    templateUrl: "error404.page.html",
})
export class CError404Page {
    constructor(private appService: CAppService) {}        

    public ngOnInit(): void {  
        this.initSEO();  
    }    
    
    private initSEO(): void {
        this.appService.setTitle("404");  
        this.appService.setMeta("name", "description", null);      
    }   
}
