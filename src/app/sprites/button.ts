import { Sprite, Texture } from 'pixi.js';

export class Button extends Sprite {

    constructor(image: string, callback: Function) {
        super();
        this.texture = Texture.from(image);
        this.interactive = true;
        this.on('mousedown', callback);
    }
}