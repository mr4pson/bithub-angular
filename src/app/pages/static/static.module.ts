import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CStaticPage } from './static.page';
import { CPipesModule } from 'src/app/pipes/pipes.module';

let routes = RouterModule.forChild ([        
    {path:"", component: CStaticPage},  
]);

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        CPipesModule,
        routes,
    ],
    declarations: [CStaticPage],
    exports: [CStaticPage],
})
export class CStaticModule {}
