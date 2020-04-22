import { Container, Sprite } from 'pixi.js';
import { Scene } from './scene';
import { images } from '../../assets/textureList';

export class SplashScene extends Scene {

    parent: Container;
    private splashImage = Sprite.from(images.splash);
    private frameCount = 0;
    isActive = true;

    constructor(parentContainer: Container) {
        super();
        this.parent = parentContainer;
        this.parent.addChild(this.splashImage);
    }

    draw() {
        this.frameCount++;
        if (this.frameCount >= 120) {
            this.splashImage.alpha -= 0.05;
        }
        if (this.splashImage.alpha <= 0) {
            this.isActive = false;
        }
    }
}