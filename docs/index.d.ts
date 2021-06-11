export interface ISourceLine  {
    idx:number;
    str:string;
    X:number;
    y:number;
    z:Number;
}
export interface IConfig {

}
export interface IFiles {
    dir: string,
    files: string[];
    get: (pattern:string)=>string;
    formatPath: (s:string) => string;
}
export interface IHole {
    splitHoles:(filename:string)=>string;

}
export interface IContainer {
    config:any;
    hole:any;
    Files: IFiles;
    Gerber:()=>void;
}