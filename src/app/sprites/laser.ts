
import { Sprite, Texture } from 'pixi.js';
import { images } from "../../assets/textureList";

export class Laser extends Sprite {

    public laserSpeed: number = 15;

    constructor(startPositionX: number, startPositionY: number) {
        super();
        this.texture = Texture.from(images.projectile);
        this.position.set(startPositionX, startPositionY);
        this.rotation = 1.57 // 45°
    }
}