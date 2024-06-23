import { IPlayer } from "./IPlayer";

export class Player implements IPlayer {
    public name: string;
    public mark: string;
    constructor(mark: string, name: string) {
        this.mark = mark;
        this.name = name;
    }
}