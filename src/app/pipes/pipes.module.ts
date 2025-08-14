import { NgModule } from "@angular/core";
import { CSafePipe } from "./safe.pipe";
import { CEolPipe } from "./eol.pipe";

@NgModule({
    declarations: [ 
        CSafePipe,
        CEolPipe,
    ],
    exports: [
        CSafePipe,
        CEolPipe,
    ]
})
export class CPipesModule {}
