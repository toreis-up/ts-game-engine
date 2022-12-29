export class Text {
  text: string;
  font: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseline: string;
  size: number;
  color: string;
  weight: string;
  _width: number;
  _height: number;
  _isCenter: boolean;
  _isMiddle: boolean;

  constructor(text: string) {
    this.text = text;
    this.font = "游ゴシック体, 'Yu Gothic', YuGothic, sans-serif";
    this.x = this.y = 0;
    this.vx = this.vy = 0;
    this.baseline = "top";
    this.size = 20;
    this.color = "#ffffff";
    this.weight = "normal";
    this._width = 0;
    this._height = 0;
    this._isCenter = false;
    this._isMiddle = false;
  }

  update(canvas: HTMLCanvasElement) {
    const _ctx = canvas.getContext("2d");

    if (_ctx === undefined || _ctx === null) {
      throw new Error("context is undefined");
    }

    _ctx.font = `${this.weight} ${this.size}px ${this.font}`;
    _ctx.fillStyle = this.color;
    _ctx.textBaseline = this.baseline as CanvasTextBaseline;

    this._width = _ctx.measureText(this.text).width;
    this._height =
      Math.abs(_ctx.measureText(this.text).actualBoundingBoxAscent) +
      Math.abs(_ctx.measureText(this.text).actualBoundingBoxDescent);

    if (this._isCenter) this.x = (canvas.width - this._width) / 2;
    if (this._isMiddle) this.y = canvas.height / 2;

    this.render(canvas, _ctx);
    this.onEnterFrame();

    this.x += this.vx;
    this.y += this.vy;
  }

  render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    if (this.x < -1 * this._width || this.x > canvas.width) return;
    if (this.y < -1 * this._height || this.y > canvas.height + this._height)
      return;

    ctx.fillText(this.text, this.x, this.y);
  }

  center() {
    this._isCenter = true;
    return this;
  }

  middle() {
    this.baseline = "middle";
    this._isMiddle = true;
    return this;
  }

  getRelactiveFingerPosition(fingerPosition: { x: number; y: number }) {
    let _relactiveFingerPosition = {
      x: fingerPosition.x - this.x,
      y: fingerPosition.y - this.y + this._height,
    };
    if (this.baseline === "top" || this.baseline === "hanging") {
      _relactiveFingerPosition = {
        x: fingerPosition.x - this.x,
        y: fingerPosition.y - this.y,
      };
    }
    if (this.baseline === "middle") {
      _relactiveFingerPosition = {
        x: fingerPosition.x - this.x,
        y: fingerPosition.y - this.y + this._height / 2,
      };
    }

    const inRange = (num: number, min: number, max: number) => {
      const _inRange = (min <= num && num <= max);
      return _inRange;
    };

    if (inRange(_relactiveFingerPosition.x, 0, this._width) && inRange(_relactiveFingerPosition.y, 0, this._height)) return _relactiveFingerPosition;

    return false;
  }

  assignTouchEvent(eventType: string, fingerPosition: {x: number, y: number}) {
    const _relactiveFingerPosition = this.getRelactiveFingerPosition(fingerPosition);

    switch (eventType) {
      case 'touchstart' :
        if (_relactiveFingerPosition) this.ontouchstart(_relactiveFingerPosition.x, _relactiveFingerPosition.y);
        break;
      case 'touchmove' :
        if (_relactiveFingerPosition) this.ontouchmove(_relactiveFingerPosition.x, _relactiveFingerPosition.y);
        break;
      case 'touchend' :
        if (_relactiveFingerPosition) this.ontouchend(_relactiveFingerPosition.x, _relactiveFingerPosition.y);
        break;
    }
  }

  onEnterFrame() {}

  ontouchstart(fingerPositionX: number, fingerPositionY: number) {}

  ontouchmove(fingerPositionX: number, fingerPositionY: number) {}
  
  ontouchend(fingerPositionX: number, fingerPositionY: number) {}
}
