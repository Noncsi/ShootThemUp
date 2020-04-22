import * as PIXI from 'pixi.js';
import { images } from '../assets/textureList'
import { SplashScene } from './scenes/splashScene';
import { Scene } from './scenes/scene';
import { MainScene } from './scenes/mainScene';
import { GameScene } from './scenes/gameScene';

var currentSceneState: SceneState;
var currentScene: Scene;
var app: PIXI.Application;

enum SceneState {
    Splash,
    Main,
    Game
}

export class Application {

    constructor(documentBody: HTMLElement) {

        app = new PIXI.Application({
            width: 800,
            height: 600
        });
        documentBody.replaceChild(app.view, documentBody.lastElementChild); // Hack for parcel HMR

        var loader = new PIXI.Loader();
        loader.add(images.exitButton);
        loader.add(images.gameButton1);
        loader.add(images.gameButton2);
        loader.add(images.gameButton3);
        loader.add(images.starBig);
        loader.add(images.starMedium);
        loader.add(images.starSmall);
        loader.add(images.logo);
        loader.add(images.closeBackground);
        loader.add(images.farBackground);
        loader.add(images.backgroundColor);
        loader.add(images.enemyShip);
        loader.add(images.particle);
        loader.add(images.projectile);
        loader.add(images.playerShip);

        loader.load(runGame);
        currentSceneState = SceneState.Splash;
        currentScene = new SplashScene(app.stage);
    }
}

// the loop
function runGame() {
    requestAnimationFrame(runGame);
    if (currentScene.isActive) {
        currentScene.draw();
    } else {
        if (currentSceneState == SceneState.Splash) {
            currentSceneState = SceneState.Main;
            currentScene = new MainScene(app.stage);
            currentScene.isActive = true;
        }
        else if (currentSceneState == SceneState.Main) {
            currentSceneState = SceneState.Game;
            currentScene = new GameScene(app.stage);
            currentScene.isActive = true;
        }
        else if (currentSceneState == SceneState.Game) {
            currentSceneState = SceneState.Main;
            currentScene = new MainScene(app.stage);
            currentScene.isActive = true;
        }
    }
}