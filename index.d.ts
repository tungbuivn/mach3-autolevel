export interface Inst {
    get<T>(cls: { new(): T }): T;
}
export interface IPoint2D {
    x:number;
    y:number;
}