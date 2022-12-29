import { Scene } from "./scene";
import { Sound } from "./sound";

interface KeyboardArray {
  [index: string]: string;
}

interface KeyboardStateArray {
  [index: string]: boolean;
}

interface SoundArray {
  [index: string]: Sound;
}

export class Game {
  canvas: HTMLCanvasElement;
  scenes: Scene[];
  currentScene?: Scene;
  input: KeyboardStateArray;
  keys: KeyboardArray;
  private _temporaryCurrentScene: Scene;
  private _preloadPromises: Promise<void>[];
  sounds: SoundArray;
  private _isAlreadyTouched: boolean;
  private _hasFinishedSetting: boolean;

  constructor() {
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);
    this.resizeCanvas();

    this.scenes = [];
    this.sounds = {};
    this.input = {};
    this.keys = {};
    this._isAlreadyTouched = false;
    this._hasFinishedSetting = false;

    this._temporaryCurrentScene = new Scene();
    this._preloadPromises = [];
  }

  preload(...imgSrcs: string[]) {
    const _assets = imgSrcs;
    for (let i = 0; i < _assets.length; i++) {
      this._preloadPromises[i] = new Promise<void>((resolve, reject) => {
        if (_assets[i].match(/\.(jpg|jpeg|png|gif)$/i)) {
          let _img = new Image();
          _img.src = _assets[i];

          _img.addEventListener(
            "load",
            () => {
              resolve();
            },
            { passive: true, once: true }
          );

          _img.addEventListener(
            "error",
            () => {
              reject(`image asset: ${_assets[i]} can't load.`);
            },
            { passive: true, once: true }
          );
        } else if (_assets[i].match(/\.(wav|wave|mp3|ogg)$/i)) {
          let _sound = new Sound(_assets[i]);
          _sound.src = _assets[i];
          this.sounds[_assets[i]] = _sound;
          this.sounds[_assets[i]].load();

          _sound.addEventListener(
            "canplaythrough",
            () => {
              resolve();
            },
            { passive: true, once: true }
          );
          _sound.addEventListener(
            "error",
            () => {
              reject(`sound asset: ${_assets[i]} can't load.`);
            },
            { passive: true, once: true }
          );
        } else {
          reject(`asset: ${_assets} is not supported by preload.`);
        }
      });
    }
  }

  main(callback: Function) {
    Promise.all(this._preloadPromises)
      .then((result) => {
        callback();
      })
      .catch((reject) => {
        console.error(reject);
      });
  }

  start() {
    addEventListener("resize", () => {
      this.resizeCanvas();
    });

    this.keybind("up", "ArrowUp");
    this.keybind("down", "ArrowDown");
    this.keybind("right", "ArrowRight");
    this.keybind("left", "ArrowLeft");

    this.currentScene = this.currentScene || this.scenes[0];

    this._mainLoop();

    this._waitUserManipulation();
  }

  keybind(name: string, key: string) {
    this.keys[name] = key;
    this.input[name] = false;
  }

  _waitUserManipulation() {
    const _playAllSounds = (e: Event) => {
      e.preventDefault();
      this._isAlreadyTouched = true;

      const _playPromises = [];

      for (let sound in this.sounds) {
        this.sounds[sound].load();
        this.sounds[sound].muted = true;
        _playPromises.push(this.sounds[sound].play());
      }

      Promise.all(_playPromises)
        .then(() => {
          for (let sound in this.sounds) {
            this.sounds[sound].stop;
          }
        })
        .catch((err) => {
          console.log(err);
        });

      setTimeout(() => {
        this._setEventListener();
        this._hasFinishedSetting = true;
      }, 2000);
    };

    this.canvas.addEventListener("touchstart", _playAllSounds, {
      passive: false,
      once: true,
    });
    addEventListener("keydown", _playAllSounds, {
      passive: false,
      once: true,
    });
  }

  _setEventListener() {
    const _keyEvent = (e: KeyboardEvent) => {
      e.preventDefault();

      for (let key in this.keys) {
        switch (e.type) {
          case "keydown":
            if (e.key === this.keys[key]) this.input[key] = true;
            break;
          case "keyup":
            if (e.key === this.keys[key]) this.input[key] = false;
            break;
        }
      }
    };

    addEventListener("keydown", _keyEvent, { passive: false });
    addEventListener("keyup", _keyEvent, { passive: false });

    const _touchEvent = (e: TouchEvent) => {
      e.preventDefault();

      const _touches = e.changedTouches[0];
      const _rect = (_touches.target as HTMLElement).getBoundingClientRect();
      const _fingerPosition = {
        x: ((_touches.clientX - _rect.left) / _rect.width) * this.canvas.width,
        y: ((_touches.clientY - _rect.top) / _rect.height) * this.canvas.height,
      };

      const _eventType = e.type;
      this.currentScene?.assignTouchEvent(_eventType, _fingerPosition);
    };

    this.canvas.addEventListener("touchstart", _touchEvent, { passive: false });
    this.canvas.addEventListener("touchmove", _touchEvent, { passive: false });
    this.canvas.addEventListener("touchend", _touchEvent, { passive: false });
  }

  _mainLoop() {
    const ctx = this.canvas.getContext("2d");
    if (ctx === null) {
      throw new Error("canvas is not defined");
    }
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this._isAlreadyTouched) this.startPanel();
    else if (this._hasFinishedSetting) {
      if (this.currentScene === undefined) {
        throw new Error("current scene is undefined.");
      }
      this.currentScene.update(this.canvas);

      if (this._temporaryCurrentScene !== this.currentScene)
        this.currentScene.onChangeScene();

      this.currentScene.objs.forEach((sprite) => {
        sprite.update(this.canvas);
      });

      this._temporaryCurrentScene = this.currentScene;
    }

    requestAnimationFrame(this._mainLoop.bind(this));
  }

  startPanel() {
    const _text = "タップ、または何かキーを押してね！";
    const _font = "游ゴシック体, 'Yu Gothic', YuGothic, sans-serif";
    const _fontSize = this.canvas.width / 20;
    const _ctx = this.canvas.getContext("2d");
    if (_ctx === null) {
      throw new Error("canvas is null");
    }
    const _textWidth = _ctx.measureText(_text).width;
    _ctx.font = `normal ${_fontSize}px ${_font}`;
    _ctx.textBaseline = "middle";
    _ctx.fillStyle = "#aaaaaa";
    _ctx.fillText(
      _text,
      (this.canvas.width - _textWidth) / 2,
      this.canvas.height / 2
    );
  }

  addScene(scene: Scene) {
    this.scenes.push(scene);
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth || this.canvas.width;
    this.canvas.height = window.innerHeight || this.canvas.height;
  }
}
