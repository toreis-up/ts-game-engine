import { Tile } from "./tile";

export class Tilemap {
  img: HTMLImageElement;
  x: number;
  y: number;
  size: number;
  data: number[][];
  tiles: Tile[];
  vx: number;
  vy: number;
  obstacles: number[]; // 壁判定のタイル番号

  constructor(imgSrc: string, size = 32) {
    this.img = new Image();
    this.img.src = imgSrc;
    this.x = this.y = 0;
    this.size = size;
    this.data = [];
    this.tiles = [];
    this.vx = this.vy = 0;
    this.obstacles = [0];
  }

  hasObstacle(mapX: number, mapY: number) {
    const _isObstacleTile = this.obstacles.some(
      (obstacle) => obstacle === this.data[mapY][mapX]
    );
    return _isObstacleTile;
  }

  addTile(tile: Tile) {
    tile.mapX = tile.x / this.size;
    tile.mapY = tile.y / this.size;
    if (!tile.isSynchronize) {
      tile.mapX = (tile.x - this.x) / this.size;
      tile.mapY = (tile.y - this.y) / this.size;
    }
    this.tiles.push(tile);
  }

  update(canvas: HTMLCanvasElement) {
    this.render(canvas);
    this.onEnterFrame();

    this.x += this.vx;
    this.y += this.vy;

    this.tiles.forEach((tile) => {
      if (tile.isSynchronize) {
        tile.shiftX = this.x;
        tile.shiftY = this.y;
      }
      tile.update(canvas);

      tile.mapX = tile.x / this.size;
      tile.mapY = tile.y / this.size;
      if (!tile.isSynchronize) {
        tile.mapX = (tile.x - this.x) / this.size;
        tile.mapY = (tile.y - this.y) / this.size;
      }
    });
  }

  setObstacles(obstacles: number[]) {
    this.obstacles = obstacles;
  }

  setMap(data: number[][]) {
    this.data = data;
  }

  render(canvas: HTMLCanvasElement) {
    this.data.forEach((y, indexY) => {
      const _tileY = this.size * indexY + this.y;
      if (_tileY < -1 * this.size || _tileY > canvas.height) return;

      this.data[indexY].forEach((x, indexX) => {
        const _tileX = this.size * indexX + this.x;
        if (_tileX < -1 * this.size || _tileX > canvas.width) return;

        const _frameX =
          this.data[indexY][indexX] % (this.img.width / this.size);
        const _frameY = ~~(
          this.data[indexY][indexX] /
          (this.img.width / this.size)
        );

        const _ctx = canvas.getContext("2d");

        _ctx?.drawImage(
          this.img,
          this.size * _frameX,
          this.size * _frameY,
          this.size,
          this.size,
          _tileX,
          _tileY,
          this.size,
          this.size
        );
      });
    });
  }

  getRelactiveFingerPosition(fingerPosition: { x: number; y: number }) {
    const _relactiveFingerPosition = {
      x: fingerPosition.x - this.x,
      y: fingerPosition.y - this.y,
    };

    const inRange = (num: number, min: number, max: number) => {
      const _inRange = min <= num && num <= max;
      return _inRange;
    };

    if (
      inRange(_relactiveFingerPosition.x, 0, this.size * this.data[0].length) &&
      inRange(_relactiveFingerPosition.y, 0, this.size * this.data.length)
    )
      return _relactiveFingerPosition;
    return false;
  }

  assignTouchEvent(eventType: string, fingerPosition: {x: number, y: number}) {
    const _relactiveFingerPosition = this.getRelactiveFingerPosition(fingerPosition)

    if (!_relactiveFingerPosition) return;

    switch (eventType) {
      case 'touchstart' :
				this.ontouchstart( _relactiveFingerPosition.x, _relactiveFingerPosition.y );
				break;
			case 'touchmove' :
				this.ontouchmove( _relactiveFingerPosition.x, _relactiveFingerPosition.y );
				break;
			case 'touchend' :
				this.ontouchend( _relactiveFingerPosition.x, _relactiveFingerPosition.y );
				break;
    }

    this.tiles.forEach((tile) => {
      tile.assignTouchEvent(eventType, fingerPosition);
    })
  }

  onEnterFrame() {}

  ontouchstart(fingerPositionX: number, fingerPositionY: number) {}

  ontouchmove(fingerPositionX: number, fingerPositionY: number) {}

  ontouchend(fingerPositionX: number, fingerPositionY: number) {}
}
