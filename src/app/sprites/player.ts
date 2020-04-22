import * as PIXI from 'pixi.js';
import { images } from '../../assets/textureList';

export class PlayerShip extends PIXI.Sprite {

    public vx;
    public vy;

    constructor() {
        super();
        this.texture = PIXI.Texture.from(images.playerShip);
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.rotation = 3.14 / 2;
        this.position.set(80, 300);
        this.vx = 0;
        this.vy = 0;
    }
}

