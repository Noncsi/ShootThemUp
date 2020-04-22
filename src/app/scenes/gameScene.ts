import * as PIXI from 'pixi.js';
import { Scene } from "./scene";
import { images } from '../../assets/textureList';
import { Particle } from '../sprites/particle';
import { EnemyShip } from '../sprites/enemy';
import { PlayerShip } from '../sprites/player';
import { Laser } from '../sprites/laser';

export class GameScene extends Scene {

    private appWidth = 800;
    private appHeight = 800;
    // Sprites and SpriteArrays
    private farTilingSprite: PIXI.TilingSprite;
    private closeTilingSprite: PIXI.TilingSprite;
    private playerSprite: PlayerShip;
    private lasers: Laser[] = [];
    private enemySprites: EnemyShip[] = [];
    private particleSprites: Particle[] = [];
    // Checkers
    public isActive = false;
    private isGameOver = false;
    // Frame counters
    private enemyArriveFrameCount = 0;
    private stopFrameCount = 0;

    constructor(parentContainer: PIXI.Container) {
        super();
        this.parent = parentContainer;
        // Create background
        var backgroundSprite = PIXI.Sprite.from(images.backgroundColor);
        this.parent.addChild(backgroundSprite);

        this.farTilingSprite = PIXI.TilingSprite.fromImage(images.farBackground, this.appWidth, this.appHeight);
        this.parent.addChild(this.farTilingSprite);

        this.closeTilingSprite = PIXI.TilingSprite.fromImage(images.closeBackground, this.appWidth, this.appHeight);
        this.parent.addChild(this.closeTilingSprite);

        this.playerSprite = new PlayerShip();
        this.parent.addChild(this.playerSprite);

        // Capture keyboard keys
        let left = this.keyboardInput("ArrowLeft"),
            right = this.keyboardInput("ArrowRight"),
            up = this.keyboardInput("ArrowUp"),
            down = this.keyboardInput("ArrowDown"),
            space = this.keyboardInput("Space");

        // Left
        left.press = () => {
            this.playerSprite.vx = -5;
            this.playerSprite.vy = 0;
        };
        left.release = () => {
            if (!right.isDown && this.playerSprite.vy === 0) {
                this.playerSprite.vx = 0;
            }
        };
        // Right
        right.press = () => {
            this.playerSprite.vx = 5;
            this.playerSprite.vy = 0;
        };
        right.release = () => {
            if (!left.isDown && this.playerSprite.vy === 0) {
                this.playerSprite.vx = 0;
            }
        };
        // Up
        up.press = () => {
            this.playerSprite.vy = -5;
            this.playerSprite.vx = 0;
        };
        up.release = () => {
            if (!down.isDown && this.playerSprite.vx === 0) {
                this.playerSprite.vy = 0;
            }
        };
        // Down
        down.press = () => {
            this.playerSprite.vy = 5;
            this.playerSprite.vx = 0;
        };
        down.release = () => {
            if (!up.isDown && this.playerSprite.vx === 0) {
                this.playerSprite.vy = 0;
            }
        };
        // Shoot
        space.press = () => { }
        space.release = () => {
            var laserSprite = new Laser(this.playerSprite.position.x + this.playerSprite.height, this.playerSprite.position.y - 4)
            this.parent.addChild(laserSprite);
            this.lasers.push(laserSprite)
        };
    }

    public draw() {
        if (this.isGameOver) {
            this.playerSprite.texture = PIXI.Texture.from(images.playerParticle);
            this.playerSprite.vx = 0;
            this.playerSprite.vy = 0;
            this.stopFrameCount++;
            if (this.stopFrameCount > 60) {
                this.stopFrameCount = 0;
                this.exit(this.parent);
                this.isActive = false;
            }
        }
        else {
            this.drawBackgroundMoving();
            this.drawPlayerMoving();
            this.drawLaserMoving();
            this.drawEnemySpawn();
            this.drawEnemyMoving();
            this.collisionDetectingLaserAndEnemy();
            this.drawParticlesDisappearing();
            this.collisionDetectingPlayerAndEnemy();
        }
    }

    private drawPlayerMoving() {
        this.playerSprite.x += this.playerSprite.vx;
        this.playerSprite.y += this.playerSprite.vy;
    }

    private drawBackgroundMoving() {
        this.farTilingSprite.tilePosition.x -= 1;
        this.closeTilingSprite.tilePosition.x -= 5;
    }

    private drawLaserMoving() {
        for (var l = this.lasers.length - 1; l >= 0; l--) {
            this.lasers[l].x += this.lasers[l].laserSpeed;
            if (this.lasers[l].x > this.appWidth) {
                this.parent.removeChild(this.lasers[l]);
                this.lasers.splice(l, 1);
            }
        };
    }

    private drawEnemySpawn() {
        this.enemyArriveFrameCount++;
        if (this.enemyArriveFrameCount === 120) {
            var newEnemy = new EnemyShip(this.appWidth + 20, this.randomEvenInt(0, this.appHeight),
                this.randomEvenInt(100, this.appWidth - 10), this.randomEvenInt(100, this.appHeight - 10));
            this.enemySprites.push(newEnemy);
            this.parent.addChild(newEnemy);
            this.enemyArriveFrameCount = 0;
        };
    }

    private drawEnemyMoving() {
        for (var l = this.enemySprites.length - 1; l >= 0; l--) {
            var currentSprite: EnemyShip = this.enemySprites[l];
            currentSprite.x += currentSprite.velocity.x;
            currentSprite.y += currentSprite.velocity.y;
            currentSprite.secondsCounter++;
            if (currentSprite.secondsCounter >= currentSprite.secondsInATurn) {
                currentSprite.destination.x = this.randomEvenInt(200, this.appWidth - currentSprite.width);
                currentSprite.destination.y = this.randomEvenInt(10, this.appHeight - currentSprite.height);
                currentSprite.velocity.x = (currentSprite.destination.x - currentSprite.x) / currentSprite.secondsInATurn;
                currentSprite.velocity.y = (currentSprite.destination.y - currentSprite.y) / currentSprite.secondsInATurn;
                currentSprite.secondsCounter = 0;
            }
        };
    }

    private collisionDetectingLaserAndEnemy() {
        for (let e = 0; e < this.enemySprites.length; e++) {
            for (let l = 0; l < this.lasers.length; l++) {
                if (this.isCollisionDetected(this.lasers[l], this.enemySprites[e])) {
                    var particleSprite = new Particle();
                    particleSprite.position.set(this.enemySprites[e].x - 20, this.enemySprites[e].y - 20);
                    this.parent.addChild(particleSprite);
                    this.particleSprites.push(particleSprite);
                    this.parent.removeChild(this.enemySprites[e]);
                    this.enemySprites.splice(e, 1);
                    this.parent.removeChild(this.lasers[l]);
                    this.lasers.splice(l, 1);
                    return;
                }
            }
        }
    }

    private drawParticlesDisappearing() {
        for (var p = 0; p < this.particleSprites.length; p++) {
            this.particleSprites[p].frameCount++;
            if (this.particleSprites[p].frameCount == 60) {
                this.parent.removeChild(this.particleSprites[p]);
            }
        }
    }
    private collisionDetectingPlayerAndEnemy() {
        for (let e = 0; e < this.enemySprites.length; e++) {
            if (this.isCollisionDetected(this.playerSprite, this.enemySprites[e])) {
                this.isGameOver = true;
            }
        }
    }

    private isCollisionDetected(r1, r2): boolean {
        let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
        hit = false;

        r1.centerX = r1.x + r1.width / 2;
        r1.centerY = r1.y + r1.height / 2;
        r2.centerX = r2.x + r2.width / 2;
        r2.centerY = r2.y + r2.height / 2;

        r1.halfWidth = r1.width / 2;
        r1.halfHeight = r1.height / 2;
        r2.halfWidth = r2.width / 2;
        r2.halfHeight = r2.height / 2;

        vx = r1.centerX - r2.x;
        vy = r1.centerY - r2.y;

        combinedHalfWidths = r1.halfWidth + r2.halfWidth;
        combinedHalfHeights = r1.halfHeight + r2.halfHeight;

        if (Math.abs(vx) < combinedHalfWidths) {
            if (Math.abs(vy) < combinedHalfHeights) {
                hit = true;
            } else {
                hit = false;
            }
        } else {
            hit = false;
        }
        return hit;
    };

    private keyboardInput(value: string) {
        let key: any = {
            isDown: false,
            isUp: true,
            press: undefined,
            release: undefined,
        };
        key.downHandler = event => {
            if (event.code === value) {
                if (key.isUp && key.press) {
                    key.press();
                    key.isDown = true;
                    key.isUp = false;
                    event.preventDefault();
                }
            }
        };
        key.upHandler = event => {
            if (event.code === value) {
                if (key.isDown && key.release) {
                    key.release();
                    key.isDown = false;
                    key.isUp = true;
                    event.preventDefault();
                }
            }
        };

        const downListener = key.downHandler.bind(key);
        const upListener = key.upHandler.bind(key);

        window.addEventListener("keydown", downListener, false);
        window.addEventListener("keyup", upListener, false);

        key.unsubscribe = () => {
            window.removeEventListener("keydown", downListener);
            window.removeEventListener("keyup", upListener);
        };
        return key;
    };

    private randomEvenInt(min, max) {
        var evenInt = Math.floor(Math.random() * (max - 1 - min + 1)) + min;
        if (evenInt % 2 != 0) {
            evenInt += 1;
        }
        return evenInt;
    };
}