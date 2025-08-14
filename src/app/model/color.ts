export class CColor {
    constructor(
        public red: number,
        public green: number,
        public blue: number,
    ) {}    

    public toString(): string {
        return `rgb(${this.red}, ${this.green}, ${this.blue})`;
    }
}
