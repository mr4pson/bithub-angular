import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'eol'})
export class CEolPipe implements PipeTransform {  
    public transform(value: string): string {
        return value?.replace(/\n/g, "<br>");        
    }
}
