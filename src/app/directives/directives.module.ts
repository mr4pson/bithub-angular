import { NgModule } from "@angular/core";
import { CTrimDirective } from "./trim.directive";
import { NgModel } from "@angular/forms";
import { CStopPropagationDirective } from "./stop-propagation.directive";

@NgModule({
    declarations: [     
        CTrimDirective,
        CStopPropagationDirective,
    ],
    exports: [   
        CTrimDirective,
        CStopPropagationDirective,
    ],    
    providers: [
        NgModel,
    ],
})
export class CDirectivesModule {}
