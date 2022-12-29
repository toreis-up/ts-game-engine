import { Sprite } from "./sprite";

export class DPad extends Sprite {
  size: number;
  arrow: {
    [index: string]: boolean
  }

  constructor(imgSrc: string, size: number) {
    super(imgSrc, size, size);
    this.size = size
    this.arrow = {
      up: false,
      down: false,
      left: false,
      right: false,
    };
    this.initializeAllow();
  }

  ontouchstart(fingerPositionX: number, fingerPositionY: number): void {
    this._applyToDPad(fingerPositionX, fingerPositionY);
  }

  ontouchmove(fingerPositionX: number, fingerPositionY: number): void {
    this._applyToDPad(fingerPositionX, fingerPositionY);
  }

  ontouchend(fingerPositionX: number, fingerPositionY: number): void {
    this.frame = 0;
    this.initializeAllow();
  }

  _applyToDPad(fingerPositionX: number, fingerPositionY: number) {
    this.frame = 1;
    this.initializeAllow();

    if ( fingerPositionX > fingerPositionY && fingerPositionX < this.size - fingerPositionY ) {
			this.arrow.up = true;
			this.rotate = 0;
		}
		else if ( fingerPositionX > this.size - fingerPositionY && fingerPositionX < fingerPositionY ) {
			this.arrow.down = true;
			this.rotate = 180;
		}
		else if ( fingerPositionY > fingerPositionX && fingerPositionY < this.size - fingerPositionX ) {
			this.arrow.left = true;
			this.rotate = 270;
		}
		else if ( fingerPositionY > this.size - fingerPositionX && fingerPositionY < fingerPositionX ) {
			this.arrow.right = true;
			this.rotate = 90;
		}
  }

  initializeAllow() {
    this.arrow = {
      up: false,
      down: false,
      left: false,
      right: false,
    };
  }
}