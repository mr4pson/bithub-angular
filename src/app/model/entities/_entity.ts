export abstract class CEntity {
    public id?: number;    
    
    public build (o: Object): any {
        for (let field in o) {
            this[field] = o[field];
        }
        
        return this;
    }
}

export interface IEntity {
    readonly id?: number;
}
