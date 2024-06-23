import { IPlayer } from "./IPlayer";

export class Player implements IPlayer {
    constructor(public mark: string) {}
}