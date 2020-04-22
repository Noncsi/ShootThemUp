import { Sprite, Texture } from 'pixi.js';
import { images } from "../../assets/textureList";

export class EnemyShip extends Sprite {

    public destination = { x: 0, y: 0 };
    public velocity = { x: -2, y: 0 };
    public secondsInATurn;
    public secondsCounter = 0;

    constructor(startingPositionX, startingPositionY, destinationX, destinationY) {
        super();
        this.texture = Texture.from(images.enemyShip);
        this.anchor.set(0.5, 0.5);
        this.rotation = 1.57 // 45°
        this.position.set(startingPositionX, startingPositionY)
        this.destination.x = destinationX;
        this.destination.y = destinationY;
        this.secondsInATurn = this.randomInt(60, 300);
    }

    private randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}