import { Sprite } from "./sprite";
import { Text } from "./text";
import { Tilemap } from "./tilemap";

export class Scene {
  objs: (Tilemap | Text | Sprite)[]
  constructor() {
    this.objs = [] as (Tilemap | Text | Sprite)[];
  }

  addObject(obj: (Tilemap | Text | Sprite)) {
    this.objs.push(obj);
  }

  update(canvas: HTMLCanvasElement) {
    this.onEnterFrame();
  }

  assignTouchEvent(eventType: string, fingerPosition: {x: number, y: number}) {
    switch(eventType) {
      case 'touchstart' :
        this.ontouchstart(fingerPosition.x, fingerPosition.y);
        break;
      case 'touchmove' :
        this.ontouchmove(fingerPosition.x, fingerPosition.y);
        break;
      case 'touchend' :
        this.ontouchend(fingerPosition.x, fingerPosition.y);
        break;
    }
    this.objs.forEach((obj) => {
      obj.assignTouchEvent(eventType, fingerPosition);
    })
  }

  onEnterFrame() {}

  onChangeScene() {}

  ontouchstart(fingerPositionX: number, fingerPositionY: number) {}

  ontouchmove(fingerPositionX: number, fingerPositionY: number) {}

  ontouchend(fingerPositionX: number, fingerPositionY: number) {}
}