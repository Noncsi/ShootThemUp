import { Sprite, Texture } from 'pixi.js';
import { images } from "../../assets/textureList";

export class Particle extends Sprite {

    public frameCount = 0;

    constructor() {
        super();
        this.texture = Texture.from(images.particle);
    }
}