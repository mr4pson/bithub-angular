import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CError404Page } from "./404/error404.page";

let routes = RouterModule.forChild ([            
	{path: "404", component: CError404Page},	
]);

@NgModule({	
    imports: [	
		CommonModule,
		RouterModule,   
        routes,		
	],
	declarations: [
		CError404Page,
	],    		    
})
export class CErrorsModule {}