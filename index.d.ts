export interface Inst {
    get<T>(cls: { new(): T }): T;
}