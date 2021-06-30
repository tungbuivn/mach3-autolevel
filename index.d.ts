export interface Inst {
    get<T>(cls: { new(): T }): T;
}
export interface IPoint2D {
    x:number;
    y:number;
}
export interface IArc {
    start:IPoint2D;
    end:IPoint2D;
    center:IPoint2D;
}
export interface ILine {
    p1:IPoint2D;
    p2:IPoint2D;
}
export interface IVector2D {
    dx:number;
    dy:number;
}
export interface IPolar {
    phi:number;
    radius:number;
}