import { Sprite } from "./sprite";

export class Tile extends Sprite {
  size: number
  isSynchronize: boolean;
  mapX: number;
  mapY: number;

  constructor(imgSrc:string, isSync = true, size = 32) {
    super(imgSrc, size, size);
    this.size = size
    this.isSynchronize = isSync;
    this.mapX = this.mapY = 0;
  }

  isOverlapped(tile: Tile) {
    const _isOverlapped = (this.mapX === tile.mapX && this.mapY === tile.mapY);
    return _isOverlapped;
  }
}