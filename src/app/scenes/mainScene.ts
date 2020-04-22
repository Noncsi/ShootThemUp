import * as PIXI from 'pixi.js';
import { Scene } from "./scene";
import { images } from '../../assets/textureList';
import { Button } from '../sprites/button';

export class MainScene extends Scene {

    public isActive = false;
    public parent;
    private starSprites: PIXI.AnimatedSprite[] = [];
    private canStart: boolean = false;

    constructor(parentContainer: PIXI.Container) {
        super();
        this.parent = parentContainer;
        // create background
        let backgroundSprite = PIXI.Sprite.from(images.backgroundColor);
        this.parent.addChild(backgroundSprite);

        var starFrames = [];
        starFrames[0] = PIXI.Texture.from(images.starSmall);
        starFrames[1] = PIXI.Texture.from(images.starMedium);
        starFrames[2] = PIXI.Texture.from(images.starBig);

        for (let i = 0; i < 40; i++) {
            var newStar = new PIXI.AnimatedSprite(starFrames);
            newStar.position.set(randomInt(0, this.parent.width), randomInt(0, this.parent.height));
            newStar.anchor.set(0.5, 0.5);
            newStar.animationSpeed = 0.1
            if (i % 2 === 0) { // make every other a little different
                newStar.animationSpeed = -0.2
            }
            this.starSprites.push(newStar);
            this.parent.addChild(newStar);
            newStar.play();
        }

        var logo = PIXI.Sprite.from(images.logo);
        logo.position.set((this.parent.width / 2) - (logo.width / 2),
            (this.parent.height / 5) - (logo.height / 2));
        this.parent.addChild(logo);

        var buttonContainer = new PIXI.Container();
        var button1 = new Button(images.gameButton1, this.startGame.bind(this));
        buttonContainer.addChild(button1);

        var button2 = new Button(images.gameButton2, this.startGame.bind(this));
        button2.y = button1.height + 10;
        buttonContainer.addChild(button2);

        var button3 = new Button(images.gameButton3, this.startGame.bind(this));
        button3.y = button2.y + button2.height + 10;
        buttonContainer.addChild(button3);

        var exitbutton = new Button(images.exitButton, this.goElsewhere);
        exitbutton.y = button3.y + button3.height + 10;
        buttonContainer.addChild(exitbutton);

        buttonContainer.position.set(
            (this.parent.width / 2) - (buttonContainer.width / 2),
            (this.parent.height / 1.7) - (buttonContainer.height / 2));
        this.parent.addChild(buttonContainer);
    };

    private startGame(): void {
        this.canStart = true;
    };

    private goElsewhere(): void {
        window.open("https://youtu.be/dQw4w9WgXcQ");
    };

    public draw() {
        for (let i = 0; i < this.starSprites.length; i++) {
            if (i % 2 == 0) {
                this.starSprites[i].rotation += 0.1;
            } else {
                this.starSprites[i].rotation += -0.1;
            }
        }
        if (this.canStart) {
            this.exit;
            this.isActive = false;
        }
    }
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

