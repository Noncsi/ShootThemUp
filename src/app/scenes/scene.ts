export abstract class Scene {

    parent: PIXI.Container;
    abstract isActive;
    abstract draw();
    exit(container: PIXI.Container) {
        container.removeChildren(0, container.children.length);
    };
};